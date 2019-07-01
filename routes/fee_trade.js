const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_PHIGIAODICH]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSPHI] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const TENPHI = req.body.TENPHI;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
            (TENPHI, TYLETINH, NGAYAPDUNG, GHICHU, NGAYTAO, FLAG) VALUES 
            (N'${TENPHI}', '${TYLETINH}', '${moment(NGAYAPDUNG).toISOString()}', N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1});`
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
        const MSPHI = req.body.MSPHI;
        const TENPHI = req.body.TENPHI;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENPHI = N'${TENPHI}', 
                        TYLETINH = '${TYLETINH}', 
                        NGAYAPDUNG = '${moment(NGAYAPDUNG).toISOString()}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSPHI = '${MSPHI}' `;
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
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;