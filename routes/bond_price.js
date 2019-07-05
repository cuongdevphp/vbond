const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_GIATRITRAIPHIEU]';
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';
const tbl_interest_rate = '[dbo].[TB_LAISUAT]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                p.*, a.MSTP, b.MSLS
            FROM
                ${tbl} p 
            LEFT JOIN ${tbl_bond} a ON a.BONDID = p.BOND_ID 
            LEFT JOIN ${tbl_interest_rate} b ON b.MSLS = p.MS_LS 
            ORDER BY
                p.MSGIATRI DESC;
        `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const BOND_ID = req.body.BOND_ID;
        const GIATRI_HIENTAI = req.body.GIATRI_HIENTAI;
        const NGAY_AP = req.body.NGAY_AP;
        const NGAY_HH = req.body.NGAY_HH;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (BOND_ID, GIATRI_HIENTAI, NGAY_AP, NGAY_HH, GHICHU, TRANGTHAI, NGAYTAO, FLAG) VALUES 
        (${BOND_ID}, ${GIATRI_HIENTAI}, '${moment(NGAY_AP).toISOString()}', '${moment(NGAY_HH).toISOString()}', N'${GHICHU}', ${TRANGTHAI}, '${moment().toISOString()}', ${1});`
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
    header.jwtVerify(req, res);
    try {
        const MSGIATRI = req.body.MSGIATRI;
        const BOND_ID = req.body.BOND_ID;
        const GIATRI_HIENTAI = req.body.GIATRI_HIENTAI;
        const MS_LS = req.body.MS_LS;
        const NGAY_AP = req.body.NGAY_AP;
        const NGAY_HH = req.body.NGAY_HH;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        GIATRI_HIENTAI = ${GIATRI_HIENTAI}, 
                        MS_LS = '${MS_LS}', 
                        NGAY_AP = '${moment(NGAY_AP).toISOString()}',
                        NGAY_HH = '${moment(NGAY_HH).toISOString()}',
                        GHICHU = N'${GHICHU}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSGIATRI = ${MSGIATRI}`;
        try {
            await pool.request().query(sql);
            res.send('Update data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSGIATRI = req.body.MSGIATRI;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSGIATRI = ${MSGIATRI}`;
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