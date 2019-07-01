const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_LOAIROOM]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSLOAIROOM] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLOAIROOM = req.body.MSLOAINDT;
        const TENLOAIROOM = req.body.TENLOAIROOM;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const queryDulicateMSLOAIROOM = `SELECT MSLOAIROOM FROM ${tbl} WHERE MSLOAIROOM = '${MSLOAIROOM}'`;
        const rsDup = await pool.request().query(queryDulicateMSLOAIROOM);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSLOAIROOM, TENLOAIROOM, GHICHU, NGAYTAO, FLAG) VALUES 
                ('${MSLOAIROOM}', N'${TENLOAIROOM}', N'${GHICHU}', '${moment().toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLOAIROOM has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLOAIROOM = req.body.MSLOAINDT;
        const TENLOAIROOM = req.body.TENLOAIROOM;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENLOAIROOM = N'${TENLOAIROOM}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE MSLOAIROOM = ${MSLOAIROOM}`;
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
        const MSLOAIROOM = req.body.MSLOAIROOM;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLOAIROOM = ${MSLOAIROOM}`;
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