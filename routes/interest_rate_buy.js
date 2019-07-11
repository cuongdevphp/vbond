const express = require('express');
const header = require('../header');
const common = require('../common');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_LAISUATMUA]';
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';
const tbl_bond_price = '[dbo].[TB_GIATRITRAIPHIEU]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                p.*, a.MSTP 
            FROM
                ${tbl} p 
            LEFT JOIN ${tbl_bond} a ON a.BONDID = p.BOND_ID 
            ORDER BY
                p.MSLS DESC;
        `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const BOND_ID = req.body.BOND_ID;
        const LS_TOIDA = req.body.LS_TOIDA;
        const LS_BIENDO = req.body.LS_BIENDO;
        const DIEUKHOAN_LS = req.body.DIEUKHOAN_LS || '';
        
        const queryDulicateMSLS = `SELECT MSLS FROM ${tbl} WHERE MSLS = '${MSLS}'`;
        const rsDup = await pool.request().query(queryDulicateMSLS);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (BOND_ID, LS_TOIDA, LS_TH, LS_BIENDO, DIEUKHOAN_LS, NGAYTAO, FLAG) VALUES 
                (${BOND_ID}, ${LS_TOIDA}, ${LS_TH}, ${LS_BIENDO}, N'${DIEUKHOAN_LS}', '${moment().toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLS bị trùng!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const MSLS = req.body.MSLS;
        const BOND_ID = req.body.BOND_ID;
        const LS_TOIDA = req.body.LS_TOIDA;
        const LS_BIENDO = req.body.LS_BIENDO;
        const DIEUKHOAN_LS = req.body.DIEUKHOAN_LS;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        LS_TOIDA = ${LS_TOIDA}, 
                        LS_BIENDO = ${LS_BIENDO}, 
                        DIEUKHOAN_LS = N'${DIEUKHOAN_LS}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLS = ${MSLS}`;
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
    try {
        const MSLS = req.body.MSLS;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLS = ${MSLS}`;
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