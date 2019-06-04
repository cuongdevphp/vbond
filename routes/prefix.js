var express = require('express');
const { poolPromise } = require('../db')
var router = express.Router();

/* GET prefix listing. */

router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM [dbo].[TB_PREFIX]')
        res.json(result.recordset);
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

router.post('/create', async (req, res) => {
    try {
        const KYTU_PREFIX = req.body.KYTU_PREFIX;
        const GHICHU = req.body.GHICHU;
        const pool = await poolPromise;
        const sql = "INSERT INTO [dbo].[TB_PREFIX] (KYTU_PREFIX, GHICHU, FLAG) VALUES ('"+KYTU_PREFIX+"', '"+GHICHU+"', '4')";
        const result = await pool.request().query(sql);
        res.send('Create data successfully');
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
})

module.exports = router;