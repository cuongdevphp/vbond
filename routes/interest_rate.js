var express = require('express');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_LAISUATNGANHANG]';
/* GET prefix listing. */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [LAISUAT_ID] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const TEN_NH = req.body.TEN_NH;
        const LAISUAT_HH = req.body.LAISUAT_HH;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (TEN_NH, LAISUAT_HH, NGAYTAO, FLAG) VALUES 
            (N'${TEN_NH}', '${LAISUAT_HH}', '${new Date(Date.now()).toISOString()}', ${1});`;
        try {
            await pool.request().query(sql);
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/', async (req, res) => {
    try {
        const TEN_NH = req.body.TEN_NH;
        const LAISUAT_HH = req.body.LAISUAT_HH;
        const LAISUAT_ID = req.body.LAISUAT_ID;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TEN_NH = N'${TEN_NH}', 
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
        res.status(500).send(err.message);
    }
});

router.delete('/', async (req, res) => {
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
        res.status(500);
        res.send(err.message);
    }
});

module.exports = router;