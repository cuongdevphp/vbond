var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_ROOMINVESTOR]';
/* GET listing. */

router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSROOM] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MS_LOAIROOM = req.body.MS_LOAIROOM;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_TS = req.body.MS_TS;
        const LAISUATDUKIEN = req.body.LAISUATDUKIEN;
        const LAISUATBAN = req.body.LAISUATBAN;
        const SOLUONGRAOBAN = req.body.SOLUONGRAOBAN;
        const TONGGIATRIBAN = req.body.TONGGIATRIBAN;
        const SOTHANGCONLAI = req.body.SOTHANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (MS_LOAIROOM, BOND_ID, MS_TP, MS_TS, LAISUATDUKIEN, LAISUATBAN, SOLUONGRAOBAN, 
        TONGGIATRIBAN, SOTHANGCONLAI, TRANGTHAI, NGAYTAO, FLAG) VALUES 
        (N'${MS_LOAIROOM}', ${BOND_ID}, N'${MS_TP}', N'${MS_TS}', ${LAISUATDUKIEN}, 
        ${LAISUATBAN}, ${SOLUONGRAOBAN}, ${TONGGIATRIBAN}, ${SOTHANGCONLAI}, N'${TRANGTHAI}',
        '${new Date(Date.now()).toISOString()}', ${1});`
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
        const MSROOM = req.body.MSROOM;
        const MS_LOAIROOM = req.body.MS_LOAIROOM;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_TS = req.body.MS_TS;
        const LAISUATDUKIEN = req.body.LAISUATDUKIEN;
        const LAISUATBAN = req.body.LAISUATBAN;
        const SOLUONGRAOBAN = req.body.SOLUONGRAOBAN;
        const TONGGIATRIBAN = req.body.TONGGIATRIBAN;
        const SOTHANGCONLAI = req.body.SOTHANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_LOAIROOM = N'${MS_LOAIROOM}', 
                        BOND_ID = N'${BOND_ID}', 
                        MS_TP = N'${MS_TP}', 
                        MS_TS = N'${MS_TS}', 
                        LAISUATDUKIEN = ${LAISUATDUKIEN}, 
                        LAISUATBAN = ${LAISUATBAN}, 
                        SOLUONGRAOBAN = ${SOLUONGRAOBAN}, 
                        TONGGIATRIBAN = ${TONGGIATRIBAN}, 
                        SOTHANGCONLAI = ${SOTHANGCONLAI}, 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
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
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSROOM = ${MSROOM}`;
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