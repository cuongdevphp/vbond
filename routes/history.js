const express = require('express');
const header = require('../header');
const common = require('../common');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();

const tbl_bond = '[dbo].[TB_TRAIPHIEU]';
const tbl_investors = '[dbo].[TB_NHADAUTU]';
const tbl_set_command = '[dbo].[TB_DATLENH]';
const tbl_history = '[dbo].[TB_HISTORY]';

/* GET listing. */
router.get('/:MSNDT', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const MSNDT = req.params.MSNDT;

        const sql = `SELECT
                        p.*, 
                        b.TRANGTHAI_LENH, b.NGAY_GD,
                        c.MSTP
                    FROM 
                        ${tbl_history} p 
                    LEFT JOIN ${tbl_investors} a ON a.MSNDT = p.MS_NDT
                    LEFT JOIN ${tbl_set_command} b ON b.MSDL = p.MS_DL
                    LEFT JOIN ${tbl_bond} c ON c.BONDID = p.BOND_ID
                    WHERE p.MS_NDT = '${MSNDT}'
                    ORDER BY
                        p.HISTORYID DESC;
                `;
        console.log(sql);
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;