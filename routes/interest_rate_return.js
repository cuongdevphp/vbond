const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const { interestRateReturnTbl, bondTbl, active } = require('../tbl');

/* GET listing. */

router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.*, a.MSTP 
            FROM ${interestRateReturnTbl} p 
            LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
            WHERE p.${active}
            ORDER BY p.MSLSTDT DESC`
        );
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const LS_TOIDA = req.body.LS_TOIDA;
        const NGAYBATDAU = req.body.NGAYBATDAU;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const TRANGTHAI = req.body.TRANGTHAI;
        const BOND_ID = req.body.BOND_ID;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${interestRateReturnTbl}
            (LS_TOIDA, BOND_ID, NGAYBATDAU, NGAYKETTHUC, TRANGTHAI, NGAYTAO, FLAG) VALUES 
            (${LS_TOIDA}, ${BOND_ID}, '${moment(NGAYBATDAU).toISOString()}', '${moment(NGAYKETTHUC).toISOString()}', ${TRANGTHAI}, '${moment().toISOString()}', ${1});`
        try {
            await pool.request().query(sql);
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const MSLSTDT = req.body.MSLSTDT;
        const LS_TOIDA = req.body.LS_TOIDA;
        const NGAYBATDAU = req.body.NGAYBATDAU;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const BOND_ID = req.body.BOND_ID;
        const TRANGTHAI = req.body.TRANGTHAI;
        const KIEUDULIEU = req.body.KIEUDULIEU;
        
        const pool = await poolPromise;
        switch (KIEUDULIEU) {
            case 1:
                await pool.request().query(`
                UPDATE ${interestRateReturnTbl} SET 
                    BOND_ID = ${BOND_ID}, 
                    LS_TOIDA = ${LS_TOIDA}, 
                    NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                    NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                    TRANGTHAI = ${TRANGTHAI}, 
                    NGAYUPDATE = '${moment().toISOString()}' 
                WHERE MSLSTDT = ${MSLSTDT}`);
                break;
            case 2:
                const rs = await pool.request().query(`
                    SELECT LICHSUCAPNHAT, LS_TOIDA, NGAYBATDAU, NGAYKETTHUC
                    FROM ${interestRateReturnTbl} 
                    WHERE MSLSTDT = ${MSLSTDT}
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
                    UPDATE ${interestRateReturnTbl} SET 
                        LICHSUCAPNHAT = '${JSON.stringify(arrLICHSU)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        BOND_ID = ${BOND_ID}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                        NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLSTDT = ${MSLSTDT}`);
                } else {
                    const rsLICHSUCAPNHAT = JSON.parse(rs.recordset[0].LICHSUCAPNHAT);
                    
                    rsLICHSUCAPNHAT.push({
                        LS: rs.recordset[0].LS_TOIDA, 
                        NBD: rs.recordset[0].NGAYBATDAU, 
                        NKT: rs.recordset[0].NGAYKETTHUC,
                        NT: moment().toISOString()
                    });
                    await pool.request().query(`
                    UPDATE ${interestRateReturnTbl} SET 
                        LICHSUCAPNHAT = '${JSON.stringify(rsLICHSUCAPNHAT)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        BOND_ID = ${BOND_ID}, 
                        NGAYBATDAU = '${moment(NGAYBATDAU).toISOString()}', 
                        NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLSTDT = ${MSLSTDT}`);
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
        const MSLSTDT = req.body.MSLSTDT;
        const sql = `UPDATE ${interestRateReturnTbl} SET FLAG = ${0} WHERE MSLSTDT = ${MSLSTDT}`;
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