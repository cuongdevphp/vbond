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
        const BOND_ID = req.body.BOND_ID;
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const queryDulicateMSROOM = `SELECT MSROOM FROM ${tbl} WHERE MSROOM = ${MSROOM}`;
        const rsDup = await pool.request().query(queryDulicateMSROOM);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (BOND_ID, LAISUATNAM, HANMUC, DANGCHO, THANGCONLAI, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                (${BOND_ID}, ${LAISUATNAM}, ${HANMUC}, ${DANGCHO}, ${THANGCONLAI}, ${TRANGTHAI}, '${new Date(Date.now()).toISOString()}', ${1});`
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
        const BOND_ID = req.body.BOND_ID;
        const LAISUATNAM = req.body.LAISUATNAM;
        const HANMUC = req.body.HANMUC;
        const DANGCHO = req.body.DANGCHO;
        const THANGCONLAI = req.body.THANGCONLAI;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        LAISUATNAM = ${LAISUATNAM}, 
                        HANMUC = ${HANMUC}, 
                        DANGCHO = ${DANGCHO}, 
                        THANGCONLAI = ${THANGCONLAI}, 
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