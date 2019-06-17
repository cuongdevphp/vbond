var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_ROOMVCSC]';
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
        const MSROOM = req.body.MSROOM;
        const MS_LOAIROOM = req.body.MS_LOAIROOM;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TS_DAMBAO = req.body.TS_DAMBAO;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const queryDulicateMSROOM = `SELECT MSROOM FROM ${tbl} WHERE MSROOM = '${MSROOM}'`;
        const rsDup = await pool.request().query(queryDulicateMSROOM);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSROOM, MS_LOAIROOM, BOND_ID, MS_TP, LAISUATNAM, HANMUC, DANGCHO, THANGCONLAI, TS_DAMBAO, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                (N'${MSROOM}', N'${MS_LOAIROOM}', ${BOND_ID}, N'${MS_TP}', ${LAISUATNAM}, ${HANMUC}, ${DANGCHO}, ${THANGCONLAI}, N'${TS_DAMBAO}', ${TRANGTHAI}, '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSROOM has been duplicate!'});
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
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TS_DAMBAO = req.body.TS_DAMBAO;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_LOAIROOM = N'${MS_LOAIROOM}', 
                        BOND_ID = ${BOND_ID}, 
                        MS_TP = N'${MS_TP}', 
                        LAISUATNAM = ${LAISUATNAM}, 
                        HANMUC = ${HANMUC}, 
                        DANGCHO = ${DANGCHO}, 
                        THANGCONLAI = ${THANGCONLAI}, 
                        TS_DAMBAO = N'${TS_DAMBAO}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSROOM = '${MSROOM}' `;
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
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSROOM = '${MSROOM}'`;
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