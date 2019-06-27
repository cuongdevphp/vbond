var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl_NDT = '[dbo].[TB_NHADAUTU]';
const tbl_datlenh = '[dbo].[TB_DATLENH]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                        p.* 
                    FROM
                        ${tbl_NDT} p
                    ORDER BY
                        MSNDT DESC;
        `
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    const investorId = req.params.id;
    if(investorId) {
        try {
            const pool = await poolPromise;
            const sql = `SELECT 
                            p.*
                        FROM 
                            ${tbl_datlenh} p 
                        WHERE MS_NDT = ${investorId} 
                        ORDER BY 
                            p.MSDL DESC;
            `;
            const result = await pool.request().query(sql);
            result.recordset.forEach(function(v) {
                v.NGAY_TRAITUC = JSON.parse(v.NGAY_TRAITUC)
            });
            return res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSNDT = req.body.MSNDT;
        const LOAINDT = req.body.LOAINDT;
        const TENNDT = req.body.TENNDT;
        const CMND_GPKD = req.body.CMND_GPKD;
        const NGAYCAP = req.body.NGAYCAP;
        const NOICAP = req.body.NOICAP;
        const SO_TKCK = req.body.SO_TKCK;
        const MS_NGUOIGIOITHIEU = req.body.MS_NGUOIGIOITHIEU;

        const pool = await poolPromise;
        const queryDulicateMSNDT = `SELECT MSNDT FROM ${tbl_NDT} WHERE MSNDT = '${MSNDT}'`;
        const rsDup = await pool.request().query(queryDulicateMSNDT);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl_NDT}
                (MSNDT, LOAINDT, TENNDT, CMND_GPKD, NOICAP, NGAYCAP, SO_TKCK, MS_NGUOIGIOITHIEU, NGAYTAO, FLAG) VALUES 
                (N'${MSNDT}', N'${LOAINDT}', N'${TENNDT}', N'${CMND_GPKD}', N'${NOICAP}', '${new Date(NGAYCAP).toISOString()}', N'${SO_TKCK}', N'${MS_NGUOIGIOITHIEU}', '${new Date(Date.now()).toISOString()}', ${1});`
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
        const LOAINDT = req.body.LOAINDT;
        const TENNDT = req.body.TENNDT;
        const CMND_GPKD = req.body.CMND_GPKD;
        const NGAYCAP = req.body.NGAYCAP;
        const NOICAP = req.body.NOICAP;
        const SO_TKCK = req.body.SO_TKCK;
        const MS_NGUOIGIOITHIEU = req.body.MS_NGUOIGIOITHIEU;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl_NDT} SET 
                        LOAINDT = N'${LOAINDT}', 
                        TENNDT = N'${TENNDT}', 
                        CMND_GPKD = N'${CMND_GPKD}', 
                        NGAYCAP = '${new Date(NGAYCAP).toISOString()}', 
                        NOICAP = N'${NOICAP}', 
                        SO_TKCK = N'${SO_TKCK}', 
                        MS_NGUOIGIOITHIEU = N'${MS_NGUOIGIOITHIEU}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSNDT = N'${MSNDT}' `;
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
        const sql = `UPDATE ${tbl_NDT} SET FLAG = ${0} WHERE MSNDT = N'${MSNDT}'`;
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