const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const { interestAgainTbl, bondTbl } = require('../tbl');

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.*, a.MSTP 
            FROM ${interestAgainTbl} p 
            LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
            ORDER BY p.MSTDT DESC`
        );
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const BOND_ID = req.body.BOND_ID;
        const MS_NDT = req.body.MS_NDT;
        const KYHUONGLAI = req.body.KYHUONGLAI;
        const TUNGAY = req.body.TUNGAY;
        const TOINGAY = req.body.TOINGAY;
        const SOTIEN = req.body.SOTIEN;
        const LS_APDUNG = req.body.LS_APDUNG;
        const SONGAYDUKIEN = req.body.SONGAYDUKIEN;
        const SONGAYTHUCTE = req.body.SONGAYTHUCTE;
        const TIENLAI = req.body.TIENLAI;
        const TONGTIEN = req.body.TONGTIEN;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${interestAgainTbl}
            (BOND_ID, MS_NDT, KYHUONGLAI, TUNGAY, TOINGAY, SOTIEN, LS_APDUNG, SONGAYDUKIEN, SONGAYTHUCTE, TIENLAI, TONGTIEN, NGAYTAO, FLAG) VALUES 
            (N'${BOND_ID}', N'${MS_NDT}', ${KYHUONGLAI}, '${moment(TUNGAY).toISOString()}', '${moment(TOINGAY).toISOString()}', ${SOTIEN}, ${LS_APDUNG}, ${SONGAYDUKIEN}, ${SONGAYTHUCTE}, ${TIENLAI}, ${TONGTIEN}, '${moment().toISOString()}', ${1});`
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
        const MSTDT = req.body.MSTDT;
        const BOND_ID = req.body.BOND_ID;
        const MS_NDT = req.body.MS_NDT;
        const KYHUONGLAI = req.body.KYHUONGLAI;
        const TUNGAY = req.body.TUNGAY;
        const TOINGAY = req.body.TOINGAY;
        const SOTIEN = req.body.SOTIEN;
        const LS_APDUNG = req.body.LS_APDUNG;
        const SONGAYDUKIEN = req.body.SONGAYDUKIEN;
        const SONGAYTHUCTE = req.body.SONGAYTHUCTE;
        const TIENLAI = req.body.TIENLAI;
        const TONGTIEN = req.body.TONGTIEN;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${interestAgainTbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        MS_NDT = N'${MS_NDT}', 
                        KYHUONGLAI = ${KYHUONGLAI}, 
                        TUNGAY = '${moment(TUNGAY).toISOString()}', 
                        TOINGAY = '${moment(TOINGAY).toISOString()}', 
                        SOTIEN = ${SOTIEN}, 
                        LS_APDUNG = ${LS_APDUNG}, 
                        SONGAYDUKIEN = ${SONGAYDUKIEN}, 
                        SONGAYTHUCTE = ${SONGAYTHUCTE}, 
                        TIENLAI = ${TIENLAI}, 
                        TONGTIEN = ${TONGTIEN}, 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSTDT = ${MSTDT}`;
        try {
            await pool.request().query(sql);
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
        const MSTDT = req.body.MSTDT;
        const sql = `UPDATE ${interestAgainTbl} SET FLAG = ${0} WHERE MSTDT = ${MSTDT}`;
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