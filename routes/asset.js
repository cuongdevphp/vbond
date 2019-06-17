var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_TAISAN]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSTS] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSTS = req.body.MSTS;
        const MS_NDT = req.body.MS_NDT;
        const MS_DL = req.body.MS_DL;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_LENHMUA = req.body.MS_LENHMUA;
        const MS_TRANGTHAI = req.body.MS_TRANGTHAI;
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
        const queryDulicateMSTS = `SELECT MSTS FROM ${tbl} WHERE MSTS = '${MSTS}'`;
        const rsDup = await pool.request().query(queryDulicateMSTS);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSTS, MS_NDT, MS_DL, BOND_ID, MS_TP, MS_LENHMUA, MS_TRANGTHAI, LAISUATKHIMUA, 
                SONGAYNAMGIU, NGAYMUA, SOLUONG, DONGIA, TONGGIATRI, SL_KHADUNG, SL_DABAN, GIATRIKHIBAN, 
                LAISUATKHIBAN, TRANGTHAI, CAPGIAY_CN, NGAYTAO, FLAG) VALUES 
                (N'${MSTS}', N'${MS_NDT}', N'${MS_DL}', ${BOND_ID}, 
                N'${MS_TP}', N'${MS_LENHMUA}', ${MS_TRANGTHAI}, ${LAISUATKHIMUA}, 
                ${SONGAYNAMGIU}, '${new Date(NGAYMUA).toISOString()}', ${SOLUONG}, ${DONGIA}, 
                ${TONGGIATRI}, ${SL_KHADUNG}, ${SL_DABAN}, ${GIATRIKHIBAN}, 
                ${LAISUATKHIBAN}, ${TRANGTHAI}, N'${CAPGIAY_CN}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSTS has been duplicate!'});
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
        const MS_LENHMUA = req.body.MS_LENHMUA;
        const MS_TRANGTHAI = req.body.MS_TRANGTHAI;
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
                        MS_LOAINDT = ${MS_LOAINDT}, 
                        TENNDT = N'${TENNDT}', 
                        CMND_GPKD = ${CMND_GPKD}, 
                        NGAYCAP = '${new Date(NGAYCAP).toISOString()}', 
                        NOICAP = N'${NOICAP}', 
                        SO_TKCK = ${SO_TKCK}, 
                        MS_NGUOIGIOITHIEU = ${MS_NGUOIGIOITHIEU}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSTS = '${MSTS}' `;
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
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSTS = '${MSTS}'`;
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