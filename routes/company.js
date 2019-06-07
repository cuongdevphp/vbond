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
        const MSDN = req.body.MSDN;
        const TEN_DN = req.body.TEN_DN;
        const DIACHI = req.body.DIACHI;
        const DIENTHOAI = req.body.DIENTHOAI;
        const NGAYCAP_GP = req.body.NGAYCAP_GP;
        const EMAIL = req.body.EMAIL;
        const NGUOI_DGPL = req.body.NGUOI_DGPL;
        const TRANGTHAI = req.body.TRANGTHAI;
        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (MSDN, TEN_DN, DIACHI, DIENTHOAI, EMAIL, NGAYCAP_GP, NGUOI_DGPL, TRANGTHAI, NGAYTAO, FLAG) VALUES 
            ('${MSDN}', '${TEN_DN}', '${DIACHI}', '${DIENTHOAI}', '${EMAIL}', '${NGAYCAP_GP}', '${NGUOI_DGPL}', '${TRANGTHAI}', '${new Date(Date.now()).toISOString()}', '1');`
        const result = await pool.request().query(sql);
        res.send('Create data successful!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/update', async (req, res) => {
    try {
        const MSDN = req.body.MSDN;
        const TEN_DN = req.body.TEN_DN;
        const DIACHI = req.body.DIACHI;
        const DIENTHOAI = req.body.DIENTHOAI;
        const EMAIL = req.body.EMAIL;
        const NGUOI_DGPL = req.body.NGUOI_DGPL;
        const TRANGTHAI = req.body.TRANGTHAI;
        const NGAYCAP_GP = req.body.NGAYCAP_GP;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MSDN = '${MSDN}', 
                        TEN_DN = '${TEN_DN}', 
                        DIACHI = '${DIACHI}', 
                        DIENTHOAI = '${DIENTHOAI}', 
                        EMAIL = '${EMAIL}', 
                        NGAYCAP_GP = '${NGAYCAP_GP}', 
                        NGUOI_DGPL = '${NGUOI_DGPL}', 
                        TRANGTHAI = '${TRANGTHAI}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}',
                        MSDN = '${MSDN}'
                    WHERE MSDN = '${MSDN}' `;
        const result = await pool.request().query(sql);
        res.send('Update data successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/delete', async (req, res) => {
    try {
        const MSDN = req.body.MSDN;
        const sql = "UPDATE "+tbl+" SET FLAG = '0' WHERE MSDN = "+MSDN+"";
        const pool = await poolPromise;
        const result = await pool.request().query(sql);
        res.send('Delete data successfully');
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

module.exports = router;