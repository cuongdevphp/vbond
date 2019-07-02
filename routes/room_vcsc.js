const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl_roomVCSC = '[dbo].[TB_ROOMVCSC]';
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT 
                p.*, a.MSTP 
            FROM
                ${tbl_roomVCSC} p 
            LEFT JOIN ${tbl_bond} a ON a.BONDID = p.BOND_ID 
            ORDER BY
                p.MSROOM DESC;
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
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const queryDulicateMSROOM = `SELECT MSROOM FROM ${tbl_roomVCSC} WHERE MSROOM = ${MSROOM}`;
        const rsDup = await pool.request().query(queryDulicateMSROOM);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl_roomVCSC}
                (BOND_ID, LAISUATNAM, HANMUC, DANGCHO, THANGCONLAI, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                (${BOND_ID}, ${LAISUATNAM}, ${HANMUC}, ${DANGCHO}, ${THANGCONLAI}, ${TRANGTHAI}, '${moment().toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSROOM bị trùng!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSROOM = req.body.MSROOM;
        const BOND_ID = req.body.BOND_ID;
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl_roomVCSC} SET 
                        BOND_ID = ${BOND_ID}, 
                        LAISUATNAM = ${LAISUATNAM}, 
                        HANMUC = ${HANMUC}, 
                        DANGCHO = ${DANGCHO}, 
                        THANGCONLAI = ${THANGCONLAI}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSROOM = ${MSROOM} `;
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
        const MSROOM = req.body.MSROOM;
        const sql = `UPDATE ${tbl_roomVCSC} SET FLAG = ${0} WHERE MSROOM = ${MSROOM}`;
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