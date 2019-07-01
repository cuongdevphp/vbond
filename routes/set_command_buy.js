var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_DATLENMUA]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSLENHMUA] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MS_NDT = req.body.MS_NDT;
        const MS_ROOM = req.body.MS_ROOM;
        const MS_NGUOIBAN = req.body.MS_NGUOIBAN;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_TAISAN = req.body.MS_TAISAN;
        const SOLUONGMUA = req.body.SOLUONGMUA;
        const LAISUATMUA = req.body.LAISUATMUA;
        const LAISUAT_DH = req.body.LAISUAT_DH;
        const TONGGIATRIPHAITRA = req.body.TONGGIATRIPHAITRA;
        const NGAY_GD = req.body.NGAY_GD;
        const NGAY_DH = req.body.NGAY_DH;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (MS_NDT, MS_ROOM, MS_NGUOIBAN, BOND_ID, MS_TP, MS_TAISAN, SOLUONGMUA, LAISUATMUA, LAISUAT_DH, 
        TONGGIATRIPHAITRA, NGAY_GD, NGAY_DH, TRANGTHAI, NGAYTAO, FLAG) VALUES 
        (N'${MS_NDT}', N'${MS_ROOM}', N'${MS_NGUOIBAN}', ${BOND_ID}, N'${MS_TP}', N'${MS_TAISAN}',
        ${SOLUONGMUA}, ${LAISUATMUA}, ${LAISUAT_DH}, ${TONGGIATRIPHAITRA}, 
        '${moment(NGAY_GD).toISOString()}', '${moment(NGAY_DH).toISOString()}', N'${TRANGTHAI}',
        '${moment().toISOString()}', ${1});`
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
        const MSLENHMUA = req.body.MSLENHMUA;
        const MS_NDT = req.body.MS_NDT;
        const MS_ROOM = req.body.MS_ROOM;
        const MS_NGUOIBAN = req.body.MS_NGUOIBAN;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_TAISAN = req.body.MS_TAISAN;
        const SOLUONGMUA = req.body.SOLUONGMUA;
        const LAISUATMUA = req.body.LAISUATMUA;
        const LAISUAT_DH = req.body.LAISUAT_DH;
        const TONGGIATRIPHAITRA = req.body.TONGGIATRIPHAITRA;
        const NGAY_GD = req.body.NGAY_GD;
        const NGAY_DH = req.body.NGAY_DH;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_NDT = N'${MS_NDT}', 
                        MS_ROOM = N'${MS_ROOM}', 
                        MS_NGUOIBAN = N'${MS_NGUOIBAN}', 
                        BOND_ID = ${BOND_ID}, 
                        MS_TP = N'${MS_TP}', 
                        MS_TAISAN = N'${MS_TAISAN}', 
                        SOLUONGMUA = ${SOLUONGMUA}, 
                        LAISUATMUA = ${LAISUATMUA}, 
                        LAISUAT_DH = ${LAISUAT_DH}, 
                        TONGGIATRIPHAITRA = ${TONGGIATRIPHAITRA}, 
                        NGAY_GD = '${moment(NGAY_GD).toISOString()}', 
                        NGAY_DH = '${moment(NGAY_DH).toISOString()}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSLENHMUA = ${MSLENHMUA} `;
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
        const MSLENHMUA = req.body.MSLENHMUA;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLENHMUA = ${MSLENHMUA}`;
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