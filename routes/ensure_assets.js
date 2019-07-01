const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_TAISANDAMBAO]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSTSDB] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const TENTAISANDAMBAO = req.body.TENTAISANDAMBAO;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (TENTAISANDAMBAO, GHICHU, NGAYTAO, FLAG) VALUES 
            (N'${TENTAISANDAMBAO}', N'${GHICHU}', '${moment().toISOString()}', ${1});`
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
        const MSTSDB = req.body.MSTSDB;
        const TENTAISANDAMBAO = req.body.TENTAISANDAMBAO;
        const GHICHU = req.body.GHICHU;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENTAISANDAMBAO = N'${TENTAISANDAMBAO}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSTSDB = ${MSTSDB}`;
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
        const MSTSDB = req.body.MSTSDB;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSTSDB = ${MSTSDB}`;
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