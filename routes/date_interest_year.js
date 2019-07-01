const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_NGAYTINHLAITRONGNAM]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSNTLTN] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const SONGAYTINHLAI = req.body.SONGAYTINHLAI;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (SONGAYTINHLAI, GHICHU, NGAYTAO, FLAG) VALUES 
        (${SONGAYTINHLAI}, N'${GHICHU}', '${moment().toISOString()}', ${1});`
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
    header.jwtVerify(req, res);
    try {
        const MSNTLTN = req.body.MSNTLTN;
        const SONGAYTINHLAI = req.body.SONGAYTINHLAI;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        SONGAYTINHLAI = ${SONGAYTINHLAI}, 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSNTLTN = ${MSNTLTN}`;
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
    header.jwtVerify(req, res);
    try {
        const MSNTLTN = req.body.MSNTLTN;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSNTLTN = ${MSNTLTN}`;
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