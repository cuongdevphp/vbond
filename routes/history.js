const express = require('express');
const header = require('../header');
const { poolPromise } = require('../db');
const { historyTbl, bondTbl, investorsTbl, setCommandTbl } = require('../tbl');
const router = express.Router();

/* GET listing. */
router.get('/', header.verifyTokenUser, async (req, res) => {
    try {
        const pool = await poolPromise;
        const MSNDT = req.MSNDT;

        const sql = `SELECT
                        p.*, 
                        b.TRANGTHAI_LENH, b.NGAY_GD,
                        c.MSTP
                    FROM 
                        ${historyTbl} p 
                    LEFT JOIN ${investorsTbl} a ON a.MSNDT = p.MS_NDT
                    LEFT JOIN ${setCommandTbl} b ON b.MSDL = p.MS_DL
                    LEFT JOIN ${bondTbl} c ON c.BONDID = p.BOND_ID
                    WHERE p.MS_NDT = '${MSNDT}'
                    ORDER BY
                        p.HISTORYID DESC;
                `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;