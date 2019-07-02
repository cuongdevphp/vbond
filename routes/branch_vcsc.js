const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_CACCHINHAVCSC]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSCNVCSC] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSCNVCSC = req.body.MSCNVCSC;
        const TENCHINHANH = req.body.TENCHINHANH;
        const NGUOIDAIDIEN = req.body.NGUOIDAIDIEN;
        const DTNGUOIDAIDIEN = req.body.DTNGUOIDAIDIEN;
        const DIACHI = req.body.DIACHI;
        const EMAIL = req.body.EMAIL;
        const SOGPTL = req.body.SOGPTL;
        const TKNH = req.body.TKNH;
        const TENNH = req.body.TENNH;

        const pool = await poolPromise;
        const queryDulicateMSCNVCSC = `SELECT MSCNVCSC FROM ${tbl} WHERE MSCNVCSC = '${MSCNVCSC}'`;
        const rsDup = await pool.request().query(queryDulicateMSCNVCSC);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSCNVCSC, TENCHINHANH, NGUOIDAIDIEN, DTNGUOIDAIDIEN, DIACHI, EMAIL, SOGPTL, TKNH, TENNH, NGAYTAO, FLAG) VALUES 
                (N'${MSCNVCSC}', N'${TENCHINHANH}', N'${NGUOIDAIDIEN}', N'${DTNGUOIDAIDIEN}', N'${DIACHI}' , N'${EMAIL}', N'${SOGPTL}', N'${TKNH}', N'${TENNH}', '${moment().toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSCNVCSC bị trùng!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSCNVCSC = req.body.MSCNVCSC;
        const TENCHINHANH = req.body.TENCHINHANH;
        const NGUOIDAIDIEN = req.body.NGUOIDAIDIEN;
        const DTNGUOIDAIDIEN = req.body.DTNGUOIDAIDIEN;
        const DIACHI = req.body.DIACHI;
        const EMAIL = req.body.EMAIL;
        const SOGPTL = req.body.SOGPTL;
        const TKNH = req.body.TKNH;
        const TENNH = req.body.TENNH;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENCHINHANH = N'${TENCHINHANH}', 
                        NGUOIDAIDIEN = N'${NGUOIDAIDIEN}', 
                        DTNGUOIDAIDIEN = N'${DTNGUOIDAIDIEN}', 
                        DIACHI = N'${DIACHI}', 
                        EMAIL = N'${EMAIL}', 
                        SOGPTL = N'${SOGPTL}', 
                        TKNH = N'${TKNH}', 
                        TENNH = N'${TENNH}', 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSCNVCSC = '${MSCNVCSC}' `;
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
        const MSCNVCSC = req.body.MSCNVCSC;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSCNVCSC = '${MSCNVCSC}'`;
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