const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_GIAYCHUNGNHAN]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSGIAYCHUNGNHAN] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const MSGIAYCHUNGNHAN = req.body.MSGIAYCHUNGNHAN;
        const MS_TS = req.body.MS_TS;
        const MS_NDT = req.body.MS_NDT;
        const NOIDUNGCHUNGNHAN = req.body.NOIDUNGCHUNGNHAN;
        const NGAYCHUNGNHAN = req.body.NGAYCHUNGNHAN;

        const pool = await poolPromise;
        const queryDulicateMSGIAYCHUNGNHAN = `SELECT MSGIAYCHUNGNHAN FROM ${tbl} WHERE MSGIAYCHUNGNHAN = '${MSGIAYCHUNGNHAN}'`;
        const rsDup = await pool.request().query(queryDulicateMSGIAYCHUNGNHAN);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSGIAYCHUNGNHAN, MS_TS, MS_NDT, NOIDUNGCHUNGNHAN, NGAYCHUNGNHAN, NGAYTAO, FLAG) VALUES 
                (N'${MSGIAYCHUNGNHAN}', N'${MS_TS}', N'${MS_NDT}', N'${NOIDUNGCHUNGNHAN}', '${moment().toISOString(NGAYCHUNGNHAN)}', '${moment().toISOString()}', ${1});`
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
        const MSGIAYCHUNGNHAN = req.body.MSGIAYCHUNGNHAN;
        const MS_TS = req.body.MS_TS;
        const MS_NDT = req.body.MS_NDT;
        const NOIDUNGCHUNGNHAN = req.body.NOIDUNGCHUNGNHAN;
        const NGAYCHUNGNHAN = req.body.NGAYCHUNGNHAN;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_TS = ${MS_TS}, 
                        MS_NDT = N'${MS_NDT}', 
                        NOIDUNGCHUNGNHAN = N'${NOIDUNGCHUNGNHAN}', 
                        NGAYCHUNGNHAN = '${moment().toISOString(NGAYCHUNGNHAN)}', 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSGIAYCHUNGNHAN = '${MSGIAYCHUNGNHAN}' `;
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
        const MSGIAYCHUNGNHAN = req.body.MSGIAYCHUNGNHAN;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSGIAYCHUNGNHAN = '${MSGIAYCHUNGNHAN}'`;
        const pool = await poolPromise;
        try {
            await pool.request().query(sql);
            res.send('Delete data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;