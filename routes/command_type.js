var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_LOAILENH]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSLENH] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLENH = req.body.MSLENH;
        const TENLENH = req.body.TENLENH;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const queryDulicateMSLENH = `SELECT MSLENH FROM ${tbl} WHERE MSLENH = '${MSLENH}'`;
        const rsDup = await pool.request().query(queryDulicateMSLENH);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (MSLENH, TENLENH, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                (N'${MSLENH}', N'${TENLENH}', '${TRANGTHAI}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSLENH has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSLENH = req.body.MSLENH;
        const TENLENH = req.body.TENLENH;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        TENLENH = N'${TENLENH}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE MSLENH = ${MSLENH} `;
        console.log(sql, "sql");
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
        const MSLENH = req.body.MSLENH;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSLENH = '${MSLENH}'`;
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