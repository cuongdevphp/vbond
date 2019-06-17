var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_NHADAUTU]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSNDT] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSNDT = req.body.MSNDT;
        const MS_LOAINDT = req.body.MS_LOAINDT;
        const TENNDT = req.body.TENNDT;
        const CMND_GPKD = req.body.CMND_GPKD;
        const NGAYCAP = req.body.NGAYCAP;
        const NOICAP = req.body.NOICAP;
        const SO_TKCK = req.body.SO_TKCK;
        const MS_NGUOIGIOITHIEU = req.body.MS_NGUOIGIOITHIEU;

        const pool = await poolPromise;
        const queryDulicateMSNDT = `SELECT MSNDT FROM ${tbl} WHERE MSNDT = '${MSNDT}'`;
        const rsDup = await pool.request().query(queryDulicateMSNDT);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSNDT, MS_LOAINDT, TENNDT, CMND_GPKD, NOICAP, NGAYCAP, SO_TKCK, MS_NGUOIGIOITHIEU, NGAYTAO, FLAG) VALUES 
                (N'${MSNDT}', N'${MS_LOAINDT}', N'${TENNDT}', N'${CMND_GPKD}', N'${NOICAP}', '${new Date(NGAYCAP).toISOString()}', N'${SO_TKCK}', N'${MS_NGUOIGIOITHIEU}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSNDT has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSNDT = req.body.MSNDT;
        const MS_LOAINDT = req.body.MS_LOAINDT;
        const TENNDT = req.body.TENNDT;
        const CMND_GPKD = req.body.CMND_GPKD;
        const NGAYCAP = req.body.NGAYCAP;
        const NOICAP = req.body.NOICAP;
        const SO_TKCK = req.body.SO_TKCK;
        const MS_NGUOIGIOITHIEU = req.body.MS_NGUOIGIOITHIEU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_LOAINDT = N'${MS_LOAINDT}', 
                        TENNDT = N'${TENNDT}', 
                        CMND_GPKD = N'${CMND_GPKD}', 
                        NGAYCAP = '${new Date(NGAYCAP).toISOString()}', 
                        NOICAP = N'${NOICAP}', 
                        SO_TKCK = N'${SO_TKCK}', 
                        MS_NGUOIGIOITHIEU = N'${MS_NGUOIGIOITHIEU}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSNDT = '${MSNDT}' `;
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
        const MSNDT = req.body.MSNDT;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSNDT = N'${MSNDT}'`;
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