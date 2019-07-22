const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const { interestRateReturnTbl } = require('../tbl');

/* GET listing. */

router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT p.* 
            FROM ${interestRateReturnTbl} p 
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
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${interestRateReturnTbl}
            (LS_TOIDA, NGAYAPDUNG, NGAYKETTHUC, TRANGTHAI, NGAYTAO, FLAG) VALUES 
            (${LS_TOIDA}, '${moment(NGAYAPDUNG).toISOString()}', '${moment(NGAYKETTHUC).toISOString()}', ${TRANGTHAI}, '${moment().toISOString()}', ${1});`
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
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const NGAYKETTHUC = req.body.NGAYKETTHUC;
        const TRANGTHAI = req.body.TRANGTHAI;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${interestRateReturnTbl} SET 
                        LS_TOIDA = ${LS_TOIDA}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYAPDUNG = '${moment(NGAYAPDUNG).toISOString()}', 
                        NGAYKETTHUC = '${moment(NGAYKETTHUC).toISOString()}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLSTDT = ${MSLSTDT}`;
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