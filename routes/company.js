var express = require('express');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_CONGTY]';

/* GET prefix listing. */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +'');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/create', async (req, res) => {
    try {
        const TEN_DN = req.body.TEN_DN;
        const DIACHI = req.body.DIACHI;
        const DIENTHOAI = req.body.DIENTHOAI;
        const EMAIL = req.body.EMAIL;
        const NGUOI_DGPL = req.body.NGUOI_DGPL;
        const TRANGTHAI = req.body.TRANGTHAI;
        const pool = await poolPromise;
        const sql = `"INSERT INTO "+ tbl +" 
            (TEN_DN, DIACHI, DIENTHOAI, EMAIL, NGAYCAP_GP, NGUOI_DGPL, TRANGTHAI, FLAG) VALUES 
            ('${TEN_DN}', '${DIACHI}', '${DIENTHOAI}', '${EMAIL}', ${GETDATE()}, '${NGUOI_DGPL}', '${TRANGTHAI}', '1')";`
        const result = await pool.request().query(sql);
        res.send('Create data successful!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/update', async (req, res) => {
    try {
        const KYTU_PREFIX = req.body.KYTU_PREFIX;
        const GHICHU = req.body.GHICHU;
        const PREFIX_ID = req.body.PREFIX_ID;
        const pool = await poolPromise;
        const sql = "UPDATE "+tbl+" SET KYTU_PREFIX = '" +KYTU_PREFIX+ "', GHICHU = '" +GHICHU+ "' WHERE PREFIX_ID = "+PREFIX_ID+"";
        const result = await pool.request().query(sql);
        res.send('Update data successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

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