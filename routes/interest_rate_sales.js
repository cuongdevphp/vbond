const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();

const { 
    bondTbl, 
    interestSalesTbl,
    setCommandTbl, 
    interestYearTbl
} = require('../tbl');

/* GET listing. */

router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                p.*
            FROM
                ${interestSalesTbl} p 
            ORDER BY
                p.MSLS DESC;
        `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        
        const MSLS = req.body.MSLS;
        const LS_TOIDA = req.body.LS_TOIDA;
        const NGAYBATDAU = req.body.NGAYBATDAU;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const DIEUKHOAN_LS = req.body.DIEUKHOAN_LS || '';

        const queryDulicate = `SELECT MSLS FROM ${interestSalesTbl} WHERE MSLS = '${MSLS}'`;
        const rsDup = await pool.request().query(queryDulicate);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${interestSalesTbl}
            (MSLS, LS_TOIDA, DIEUKHOAN_LS, NGAYBATDAU, NGAYKETTHUC, NGAYTAO, FLAG) VALUES 
            (N'${MSLS}', ${LS_TOIDA}, N'${DIEUKHOAN_LS}', '${moment(NGAYBATDAU).toISOString()}', '${moment(NGAYKETTHUC).toISOString()}', '${moment().toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSGIAYCHUNGNHAN bị trùng!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const TRANGTHAI = parseInt(req.body.TRANGTHAI);
        const LS_TOIDA = req.body.LS_TOIDA;
        const MSLS = req.body.MSLS;
        const NGAYBATDAU = req.body.NGAYBATDAU;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const DIEUKHOAN_LS = req.body.DIEUKHOAN_LS || '';
        
        const rs = await pool.request().query(`
            SELECT p.NGAY_TRAITUC, p.TONGGIATRITRUOCPHI, c.SONGAYTINHLAI, p.MSDL 
            FROM ${setCommandTbl} p 
            LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
            LEFT JOIN ${interestSalesTbl} b ON b.MSLS = a.MS_LSB
            LEFT JOIN ${interestYearTbl} c ON c.MSNTLTN = a.MS_NTLTN
            WHERE MSLS = '${MSLS}'
        `);
        
        const rsNGAYTRAITUC = [];
        if(rs.recordset.length > 0) {
            for(let i = 0; i < rs.recordset.length; i++) {
                const data = JSON.parse(rs.recordset[i].NGAY_TRAITUC);
                for(let j = 0; j < data.length; j++) {
                    if(data[j].date > NGAYBATDAU) {
                        data[j].interestRate = parseInt(LS_TOIDA);
                        data[j].moneyReceived = rs.recordset[i].TONGGIATRITRUOCPHI * LS_TOIDA * data[j].totalDay / rs.recordset[i].SONGAYTINHLAI / 100 ;
                    }
                    rsNGAYTRAITUC.push(data[j]);
                }
                await pool.request().query(`
                    UPDATE ${setCommandTbl} SET 
                        NGAY_TRAITUC = '${JSON.stringify(rsNGAYTRAITUC)}'
                    WHERE MSDL = '${rs.recordset[i].MSDL}'
                `);
            }
        }
        switch (TRANGTHAI) {
            case 1:
                await pool.request().query(`
                UPDATE ${interestSalesTbl} SET 
                    LS_TOIDA = ${LS_TOIDA}, 
                    DIEUKHOAN_LS = N'${DIEUKHOAN_LS}', 
                    NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                    NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                    NGAYUPDATE = '${moment().toISOString()}' 
                WHERE MSLS = '${MSLS}'`);
                break;
            case 2:
                const rs = await pool.request().query(`
                    SELECT LICHSUCAPNHAT, LS_TOIDA, NGAYBATDAU, NGAYKETTHUC
                    FROM ${interestSalesTbl} 
                    WHERE MSLS = '${MSLS}'
                `);
                if(rs.recordset[0].LICHSUCAPNHAT === null) {
                    const arrLICHSU = [];
                    arrLICHSU.push({
                        LS: rs.recordset[0].LS_TOIDA,
                        NBD: rs.recordset[0].NGAYBATDAU,
                        NKT: rs.recordset[0].NGAYKETTHUC,
                        NT: moment().toISOString()
                    });
                    await pool.request().query(`
                    UPDATE ${interestSalesTbl} SET 
                        LICHSUCAPNHAT = '${JSON.stringify(arrLICHSU)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        DIEUKHOAN_LS = N'${DIEUKHOAN_LS}', 
                        NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                        NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLS = '${MSLS}'`);
                } else {
                    const rsLICHSUCAPNHAT = JSON.parse(rs.recordset[0].LICHSUCAPNHAT);
                    
                    rsLICHSUCAPNHAT.push({
                        LS: rs.recordset[0].LS_TOIDA, 
                        NBT: rs.recordset[0].NGAYBATDAU, 
                        NKT: rs.recordset[0].NGAYKETTHUC,
                        NT: moment().toISOString()
                    });
                    await pool.request().query(`
                    UPDATE ${interestSalesTbl} SET 
                        LICHSUCAPNHAT = '${JSON.stringify(rsLICHSUCAPNHAT)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        DIEUKHOAN_LS = N'${DIEUKHOAN_LS}', 
                        NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                        NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLS = '${MSLS}'`);
                }
                break;
            default:
                break;
        }
        res.send('Update data successful!');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete('/', header.verifyToken, async (req, res) => {
    try {
        const MSLS = req.body.MSLS;
        const sql = `UPDATE ${interestSalesTbl} SET FLAG = ${0} WHERE MSLS = ${MSLS}`;
        const pool = await poolPromise;
        try {
            await pool.request().query(sql);
            res.send('Delete data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;