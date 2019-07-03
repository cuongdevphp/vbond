const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_PREFIX]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [PREFIX_ID] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const KYTU_PREFIX = req.body.KYTU_PREFIX;
        const GHICHU = req.body.GHICHU || '';
        
        const pool = await poolPromise;
        await checkDupData(KYTU_PREFIX);
        const sql = `INSERT INTO ${tbl}
                    (KYTU_PREFIX, GHICHU, NGAYTAO, FLAG) VALUES 
                    (N'${KYTU_PREFIX}', N'${GHICHU}', '${moment().toISOString()}', ${1})`;
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
        const KYTU_PREFIX = req.body.KYTU_PREFIX;
        const GHICHU = req.body.GHICHU || '';
        const PREFIX_ID = req.body.PREFIX_ID;

        await checkDupData(KYTU_PREFIX);
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        KYTU_PREFIX = N'${KYTU_PREFIX}', 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE PREFIX_ID = ${PREFIX_ID}`;
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
        const PREFIX_ID = req.body.PREFIX_ID;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE PREFIX_ID = ${PREFIX_ID}`;
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

function checkDupData (KYTU_PREFIX) {
    const rsDup = await pool.request().query(`SELECT PREFIX_ID FROM ${tbl} WHERE KYTU_PREFIX = '${KYTU_PREFIX}'`);
    if(rsDup.recordset.length > 0) {
        return res.status(500).json({ error: 'Ký tự Prefix bị trùng!'});
    }
}
module.exports = router;