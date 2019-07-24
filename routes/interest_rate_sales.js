const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();

const { 
    bondTbl, 
    interestSalesTbl,
    setCommandTbl, 
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
        const TONGGIATRITRUOCPHI = req.body.TONGGIATRITRUOCPHI;
        const NGAYTRAITUC = req.body.NGAYTRAITUC;
        const SONGAYTINHLAI = req.body.SONGAYTINHLAI;
        const LS_TOIDA = req.body.LS_TOIDA;
        const MSLS = req.body.MSLS;

        const NGAYBATDAU = req.body.NGAYBATDAU;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const DIEUKHOAN_LS = req.body.DIEUKHOAN_LS || '';
        
        const rs = await pool.request().query(`
            SELECT p.NGAYTRAITUC 
            FROM ${setCommandTbl} p 
            LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
            LEFT JOIN ${interestSalesTbl} b ON b.MSLS = a.MS_LSB
            WHERE MSLS = '${MSLS}'
        `);
        console.log(rs);
        // for(let i = 0; i < NGAYTRAITUC.length; i++){
        //     if(NGAYTRAITUC[i].date >= NGAYBATDAU) {
        //         const rs = (TONGGIATRITRUOCPHI * LS_TOIDA) * NGAYTRAITUC[i].n / SONGAYTINHLAI
        //     }
        // }

        // const sql = `UPDATE ${interestSalesTbl} SET 
        //                 LS_TOIDA = ${LS_TOIDA}, 
        //                 DIEUKHOAN_LS = N'${DIEUKHOAN_LS}', 
        //                 NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
        //                 NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
        //                 NGAYUPDATE = '${moment().toISOString()}' 
        //             WHERE MSLS = '${MSLS}'`;
        try {
            //await pool.request().query(sql);
            res.send('Update data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
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