const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_TAISAN]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT * FROM ${tbl} ORDER BY [MSTS] DESC`;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MS_NDT = req.body.MS_NDT;
        const MS_DL = req.body.MS_DL || '';
        const BOND_ID = req.body.BOND_ID;
        const MS_LENHMUA = req.body.MS_LENHMUA || '';
        const LAISUATKHIMUA = req.body.LAISUATKHIMUA;
        const SONGAYNAMGIU = req.body.SONGAYNAMGIU;
        const NGAYMUA = req.body.NGAYMUA;
        const SOLUONG = req.body.SOLUONG;
        const DONGIA = req.body.DONGIA;
        const TONGGIATRI = req.body.TONGGIATRI;
        const SL_KHADUNG = req.body.SL_KHADUNG;
        const SL_DABAN = req.body.SL_DABAN;
        const GIATRIKHIBAN = req.body.GIATRIKHIBAN;
        const LAISUATKHIBAN = req.body.LAISUATKHIBAN;
        const TRANGTHAI = req.body.TRANGTHAI;
        const CAPGIAY_CN = req.body.CAPGIAY_CN;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl} 
        (MS_NDT, MS_DL, BOND_ID, MS_LENHMUA, LAISUATKHIMUA, 
        SONGAYNAMGIU, NGAYMUA, SOLUONG, DONGIA, TONGGIATRI, SL_KHADUNG, SL_DABAN, GIATRIKHIBAN, 
        LAISUATKHIBAN, TRANGTHAI, CAPGIAY_CN, NGAYTAO, FLAG) VALUES 
        (N'${MS_NDT}', N'${MS_DL}', ${BOND_ID}, 
        N'${MS_LENHMUA}', ${LAISUATKHIMUA}, 
        ${SONGAYNAMGIU}, '${moment(NGAYMUA).toISOString()}', ${SOLUONG}, ${DONGIA}, 
        ${TONGGIATRI}, ${SL_KHADUNG}, ${SL_DABAN}, ${GIATRIKHIBAN}, 
        ${LAISUATKHIBAN}, ${TRANGTHAI}, N'${CAPGIAY_CN}', '${moment().toISOString()}', ${1});`
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
        const MSTS = req.body.MSTS;
        const MS_NDT = req.body.MS_NDT;
        const MS_DL = req.body.MS_DL;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_LENHMUA = req.body.MS_LENHMUA || '';
        const LAISUATKHIMUA = req.body.LAISUATKHIMUA;
        const SONGAYNAMGIU = req.body.SONGAYNAMGIU;
        const NGAYMUA = req.body.NGAYMUA;
        const SOLUONG = req.body.SOLUONG;
        const DONGIA = req.body.DONGIA;
        const TONGGIATRI = req.body.TONGGIATRI;
        const SL_KHADUNG = req.body.SL_KHADUNG;
        const SL_DABAN = req.body.SL_DABAN;
        const GIATRIKHIBAN = req.body.GIATRIKHIBAN;
        const LAISUATKHIBAN = req.body.LAISUATKHIBAN;
        const TRANGTHAI = req.body.TRANGTHAI;
        const CAPGIAY_CN = req.body.CAPGIAY_CN;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_NDT = N'${MS_NDT}', 
                        MS_DL = N'${MS_DL}', 
                        BOND_ID = ${BOND_ID}, 
                        MS_TP = N'${MS_TP}', 
                        MS_LENHMUA = ${MS_LENHMUA}, 
                        MS_TRANGTHAI = ${MS_TRANGTHAI}, 
                        LAISUATKHIMUA = ${LAISUATKHIMUA}, 
                        SONGAYNAMGIU = ${SONGAYNAMGIU}, 
                        NGAYMUA = '${moment(NGAYMUA).toISOString()}', 
                        SOLUONG = ${SOLUONG}, 
                        DONGIA = ${DONGIA}, 
                        TONGGIATRI = ${TONGGIATRI}, 
                        SL_KHADUNG = ${SL_KHADUNG}, 
                        SL_DABAN = ${SL_DABAN}, 
                        GIATRIKHIBAN = ${GIATRIKHIBAN}, 
                        LAISUATKHIBAN = ${LAISUATKHIBAN}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        CAPGIAY_CN = N'${CAPGIAY_CN}', 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSTS = ${MSTS} `;
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
        const MSTS = req.body.MSTS;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSTS = ${MSTS}`;
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