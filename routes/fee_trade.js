var express = require('express');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_PHIGIAODICH]';
/* GET prefix listing. */
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSPHI] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const TENPHI = req.body.TENPHI;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (TENPHI, TYLETINH, NGAYAPDUNG, GHICHU, NGAYTAO, FLAG) VALUES 
            (N'${TENPHI}', '${TYLETINH}', '${new Date(NGAYAPDUNG).toISOString()}', N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1});`
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
        const MSPHI = req.body.MSPHI;
        const TENPHI = req.body.TENPHI;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENPHI = N'${TENPHI}', 
                        TYLETINH = '${TYLETINH}', 
                        NGAYAPDUNG = '${new Date(NGAYAPDUNG).toISOString()}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSPHI = '${MSPHI}' `;
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
        const MSPHI = req.body.MSPHI;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSPHI = ${MSPHI}`;
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