var express = require('express');
const { poolPromise } = require('../db')
var router = express.Router();
const tbl = '[dbo].[TB_PREFIX]';

/* GET prefix listing. */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +'');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        console.log(req.body, "req.body");
        const KYTU_PREFIX = req.body.KYTU_PREFIX;
        const GHICHU = req.body.GHICHU;
        const pool = await poolPromise;
        const sql = "INSERT INTO "+tbl+" (KYTU_PREFIX, GHICHU, FLAG) VALUES ('"+KYTU_PREFIX+"', '"+GHICHU+"', '1')";
        const result = await pool.request().query(sql);
        res.send('Create data successful!');
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// router.put('/update', async (req, res) => {
//     try {
//         const PREFIX_ID = req.body.PREFIX_ID;
//         const sql = "UPDATE "+tbl+" SET FLAG = '0' WHERE PREFIX_ID = "+PREFIX_ID+"";
//         const result = await pool.request().query(sql);
//         res.send('Delete data successfully');
//     } catch (err) {
//         res.status(500);
//         res.send(err.message);
//     }
// });

router.put('/delete', async (req, res) => {
    try {
        const PREFIX_ID = req.body.PREFIX_ID;
        const sql = "UPDATE "+tbl+" SET FLAG = '0' WHERE PREFIX_ID = "+PREFIX_ID+"";
        const pool = await poolPromise;
        const result = await pool.request().query(sql);
        res.send('Delete data successfully');
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

module.exports = router;