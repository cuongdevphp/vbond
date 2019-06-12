var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
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
        const MSNTLTN = req.body.MSNTLTN;
        const SONGAYTINHLAI = req.body.SONGAYTINHLAI;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const queryDulicateMSNTLTN = `SELECT MSNTLTN FROM ${tbl} WHERE MSNTLTN = ${MSNTLTN}`;
        const rsDup = await pool.request().query(queryDulicateMSNTLTN);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSNTLTN, SONGAYTINHLAI, GHICHU, NGAYTAO, FLAG) VALUES 
                (${MSNTLTN}, ${SONGAYTINHLAI}, N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLTP has been duplicate!'});
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
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
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