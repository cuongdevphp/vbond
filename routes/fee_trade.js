const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const { tradeFeeTbl } = require('../tbl');
const router = express.Router();
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM ${tradeFeeTbl} ORDER BY [MSPHI] DESC`);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:LOAIGIAODICH/:SOTIEN', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const LOAIGIAODICH = req.params.LOAIGIAODICH;
        const SOTIEN = req.params.SOTIEN;

        const result = await pool.request().query(`
            SELECT * 
            FROM ${tradeFeeTbl} 
            WHERE LOAIGIAODICH = ${LOAIGIAODICH} AND ${SOTIEN} BETWEEN PHIMIN AND PHIMAX
        `);
        return res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const TENPHI = req.body.TENPHI;
        const PHIMIN = req.body.PHIMIN;
        const PHIMAX = req.body.PHIMAX;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;
        const LOAIGIAODICH = req.body.LOAIGIAODICH;

        const sql = `INSERT INTO ${tradeFeeTbl}
            (TENPHI, TYLETINH, PHIMIN, PHIMAX, NGAYAPDUNG, GHICHU, LOAIGIAODICH, TRANGTHAI, NGAYTAO, FLAG) VALUES 
            (N'${TENPHI}', ${TYLETINH}, ${PHIMIN}, ${PHIMAX}, '${moment(NGAYAPDUNG).toISOString()}', N'${GHICHU}', ${LOAIGIAODICH}, ${1}, '${new Date(Date.now()).toISOString()}', ${1});`
        try {
            await pool.request().query(sql);
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const MSPHI = req.body.MSPHI;
        const TENPHI = req.body.TENPHI;
        const PHIMIN = req.body.PHIMIN;
        const PHIMAX = req.body.PHIMAX;
        const TYLETINH = req.body.TYLETINH;
        const NGAYAPDUNG = req.body.NGAYAPDUNG;
        const GHICHU = req.body.GHICHU;
        const LOAIGIAODICH = req.body.LOAIGIAODICH;

        const sql = `UPDATE ${tradeFeeTbl} SET 
                        TENPHI = N'${TENPHI}', 
                        TYLETINH = ${TYLETINH}, 
                        PHIMIN = ${PHIMIN}, 
                        PHIMAX = ${PHIMAX}, 
                        NGAYAPDUNG = '${moment(NGAYAPDUNG).toISOString()}', 
                        GHICHU = N'${GHICHU}', 
                        LOAIGIAODICH = ${LOAIGIAODICH},
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSPHI = ${MSPHI}`;
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
    try {
        const MSPHI = req.body.MSPHI;
        const sql = `UPDATE ${tradeFeeTbl} SET FLAG = ${0} WHERE MSPHI = ${MSPHI}`;
        const pool = await poolPromise;
        try {
            await pool.request().query(sql);
            res.send('Delete data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;