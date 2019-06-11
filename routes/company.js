var express = require('express');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_CONGTY]';
/* GET prefix listing. */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSDN] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const MSDN = req.body.MSDN;
        const TEN_DN = req.body.TEN_DN;
        const DIACHI = req.body.DIACHI;
        const DIENTHOAI = req.body.DIENTHOAI;
        const NGAYCAP_GP = req.body.NGAYCAP_GP;
        const EMAIL = req.body.EMAIL;
        const NGUOI_DDPL = req.body.NGUOI_DDPL;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (MSDN, TEN_DN, DIACHI, DIENTHOAI, EMAIL, NGAYCAP_GP, NGUOI_DDPL, TRANGTHAI, NGAYTAO, FLAG) VALUES 
            ('${MSDN}', N'${TEN_DN}', N'${DIACHI}', '${DIENTHOAI}', '${EMAIL}', '${new Date(NGAYCAP_GP).toISOString()}', N'${NGUOI_DDPL}', '${TRANGTHAI}', '${new Date(Date.now()).toISOString()}', ${1});`
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
        const MSDN = req.body.MSDN;
        const TEN_DN = req.body.TEN_DN;
        const DIACHI = req.body.DIACHI;
        const DIENTHOAI = req.body.DIENTHOAI;
        const EMAIL = req.body.EMAIL;
        const NGUOI_DDPL = req.body.NGUOI_DDPL;
        const TRANGTHAI = req.body.TRANGTHAI;
        const NGAYCAP_GP = req.body.NGAYCAP_GP;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TEN_DN = N'${TEN_DN}', 
                        DIACHI = N'${DIACHI}', 
                        DIENTHOAI = '${DIENTHOAI}', 
                        EMAIL = '${EMAIL}', 
                        NGAYCAP_GP = '${new Date(NGAYCAP_GP).toISOString()}', 
                        NGUOI_DDPL = N'${NGUOI_DDPL}', 
                        TRANGTHAI = '${TRANGTHAI}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSDN = '${MSDN}' `;
        console.log(sql, "sql");
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
        const MSDN = req.body.MSDN;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSDN = '${MSDN}'`;
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