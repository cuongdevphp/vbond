var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_GIATRITRAIPHIEU]';
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                p.*, a.MSTP 
            FROM
                ${tbl} p 
            LEFT JOIN ${tbl_bond} a ON a.BONDID = p.BOND_ID 
            ORDER BY
                p.MSGIATRI DESC;
        `;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSGIATRI] DESC');
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
        (${BOND_ID}, ${GIATRI_HIENTAI}, '${new Date(Date.now(NGAY_AP)).toISOString()}', '${new Date(Date.now(NGAY_HH)).toISOString()}', N'${GHICHU}', ${TRANGTHAI}, '${new Date(Date.now()).toISOString()}', ${1});`
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
        const NGAY_AP = req.body.NGAY_AP;
        const NGAY_HH = req.body.NGAY_HH;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        GIATRI_HIENTAI = ${GIATRI_HIENTAI}, 
                        NGAY_AP = '${new Date(Date.now(NGAY_AP)).toISOString()}',
                        NGAY_HH = '${new Date(Date.now(NGAY_HH)).toISOString()}',
                        GHICHU = N'${GHICHU}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
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