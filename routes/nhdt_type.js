var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_LOAINHDT]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSLOAINDT] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLOAINDT = req.body.MSLOAINDT;
        const TENLOAI_NDT = req.body.TENLOAI_NDT;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const queryDulicateMSLOAINDT = `SELECT MSLOAINDT FROM ${tbl} WHERE MSLOAINDT = '${MSLOAINDT}'`;
        const rsDup = await pool.request().query(queryDulicateMSLOAINDT);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSLOAINDT, TENLOAI_NDT, GHICHU, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                ('${MSLOAINDT}', N'${TENLOAI_NDT}', N'${GHICHU}', ${TRANGTHAI}, '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLOAINDT has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLOAINDT = req.body.MSLOAINDT;
        const TENLOAI_NDT = req.body.TENLOAI_NDT;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENLOAI_NDT = N'${TENLOAI_NDT}', 
                        GHICHU = N'${GHICHU}', 
                        TRANGTHAI = '${TRANGTHAI}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSLOAINDT = '${MSLOAINDT}' `;
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
        const MSLOAINDT = req.body.MSLOAINDT;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLOAINDT = '${MSLOAINDT}'`;
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