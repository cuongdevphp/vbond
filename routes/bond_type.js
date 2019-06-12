var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_LOAITRAIPHIEU]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSLTP] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLTP = req.body.MSLTP;
        const TENLOAI_TP = req.body.TENLOAI_TP;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const queryDulicateMSLTP = `SELECT MSLTP FROM ${tbl} WHERE MSLTP = '${MSLTP}'`;
        const rsDup = await pool.request().query(queryDulicateMSLTP);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSLTP, TENLOAI_TP, GHICHU, NGAYTAO, FLAG) VALUES 
                ('${MSLTP}', N'${TENLOAI_TP}', N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLTP has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLTP = req.body.MSLTP;
        const TENLOAI_TP = req.body.TENLOAI_TP;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENLOAI_TP = N'${TENLOAI_TP}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSLTP = '${MSLTP}' `;
        try {
            await pool.request().query(sql);
            res.send('Update data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.delete('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLTP = req.body.MSLTP;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLTP = '${MSLTP}'`;
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