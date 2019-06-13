var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_KYHANVAY]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSKHVAY] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSKHVAY = req.body.MSKHVAY;
        const THANGKYHAN = req.body.THANGKYHAN;
        const TENKYHANVAY = req.body.TENKYHANVAY;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const queryDulicateMSKHVAY = `SELECT MSKHVAY FROM ${tbl} WHERE MSKHVAY = '${MSKHVAY}'`;
        const rsDup = await pool.request().query(queryDulicateMSKHVAY);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSKHVAY, THANGKYHAN, TENKYHANVAY, GHICHU, NGAYTAO, FLAG) VALUES 
                (N'${MSKHVAY}', ${THANGKYHAN}, N'${TENKYHANVAY}', N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSKHVAY has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSKHVAY = req.body.MSKHVAY;
        const THANGKYHAN = req.body.THANGKYHAN;
        const TENKYHANVAY = req.body.TENKYHANVAY;
        const GHICHU = req.body.GHICHU;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        THANGKYHAN = ${THANGKYHAN}, 
                        TENKYHANVAY = N'${TENKYHANVAY}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
                    WHERE MSKHVAY = '${MSKHVAY}'`;
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
        const MSKHVAY = req.body.MSKHVAY;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSKHVAY = '${MSKHVAY}'`;
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