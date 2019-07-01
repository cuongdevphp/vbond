const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();
const tbl = '[dbo].[TB_KYHANTHANHTOAN]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSKYHANTT] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const LOAI_TT = req.body.LOAI_TT;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (LOAI_TT, GHICHU, NGAYTAO, FLAG) VALUES 
        (${LOAI_TT}, N'${GHICHU}', '${moment().toISOString()}', ${1});`
    try {
        await pool.request().query(sql);
        res.send('Create data successful!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSKYHANTT = req.body.MSKYHANTT;
        const LOAI_TT = req.body.LOAI_TT;
        const GHICHU = req.body.GHICHU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        LOAI_TT = ${LOAI_TT}, 
                        GHICHU = N'${GHICHU}', 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE MSKYHANTT = ${MSKYHANTT} `;
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
        const MSKYHANTT = req.body.MSKYHANTT;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSKYHANTT = ${MSKYHANTT}`;
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