var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_LAISUATNGANHANG]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [LAISUAT_ID] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const TEN_NH = req.body.TEN_NH;
        const LAISUAT_HH = req.body.LAISUAT_HH;
        const MA_NH = req.body.MA_NH;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (TEN_NH, MA_NH, LAISUAT_HH, NGAYTAO, FLAG) VALUES 
            (N'${TEN_NH}', N'${MA_NH}', '${LAISUAT_HH}', '${new Date(Date.now()).toISOString()}', ${1});`;
        try {
            await pool.request().query(sql);
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const TEN_NH = req.body.TEN_NH;
        const LAISUAT_HH = req.body.LAISUAT_HH;
        const LAISUAT_ID = req.body.LAISUAT_ID;
        const MA_NH = req.body.MA_NH;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TEN_NH = N'${TEN_NH}', 
                        MA_NH = N'${MA_NH}', 
                        LAISUAT_HH = '${LAISUAT_HH}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
                    WHERE LAISUAT_ID = '${LAISUAT_ID}' `;
        try {
            await pool.request().query(sql);
            res.send('Update data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.delete('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const LAISUAT_ID = req.body.LAISUAT_ID;

        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE LAISUAT_ID = ${LAISUAT_ID}`;
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