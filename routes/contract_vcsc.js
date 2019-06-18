var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_HOPDONGMUA_VCSC]';
const tbl_branchVCSC = '[dbo].[TB_CACCHINHAVCSC]';
const tbl_company = '[dbo].[TB_CONGTY]';
/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;        
        const sql = `SELECT
                        p.*, i.TEN_DN, o.TENCHINHANH
                    FROM
                        ${tbl} p
                    LEFT JOIN ${tbl_branchVCSC} o ON o.MSCNVCSC = p.MS_CNVCSC
                    LEFT JOIN ${tbl_company} i ON i.MSDN = p.MS_DN
                    ORDER BY
                        SOHD DESC;
                `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const SOHD = req.body.SOHD;
        const MS_DN = req.body.MS_DN;
        const MS_CNVCSC = req.body.MS_CNVCSC;
        const NGAYKY = req.body.NGAYKY;
        const LAISUAT = req.body.LAISUAT;
        const KYHAN = req.body.KYHAN;
        const NGAY_PH = req.body.NGAY_PH;
        const NGAY_DH = req.body.NGAY_DH;
        const MENHGIA_TP = req.body.MENHGIA_TP;
        const SOLUONG_PH = req.body.SOLUONG_PH;

        const pool = await poolPromise;
        const queryDulicateSOHD = `SELECT SOHD FROM ${tbl} WHERE SOHD = '${SOHD}'`;
        const rsDup = await pool.request().query(queryDulicateSOHD);
        if(rsDup.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (SOHD, MS_DN, MS_CNVCSC, NGAYKY, LAISUAT, KYHAN, NGAY_PH, NGAY_DH, MENHGIA_TP, SOLUONG_PH, NGAYTAO, FLAG) VALUES 
                (N'${SOHD}', N'${MS_DN}', '${MS_CNVCSC}', '${new Date(NGAYKY).toISOString()}', ${LAISUAT}, 
                ${KYHAN}, '${new Date(NGAY_PH).toISOString()}', 
                '${new Date(NGAY_DH).toISOString()}', ${MENHGIA_TP}, 
                ${SOLUONG_PH}, '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'SOHD has been duplicate!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const SOHD = req.body.SOHD;
        const MS_DN = req.body.MS_DN;
        const MS_CNVCSC = req.body.MS_CNVCSC;
        const NGAYKY = req.body.NGAYKY;
        const LAISUAT = req.body.LAISUAT;
        const KYHAN = req.body.KYHAN;
        const NGAY_PH = req.body.NGAY_PH;
        const NGAY_DH = req.body.NGAY_DH;
        const MENHGIA_TP = req.body.MENHGIA_TP;
        const SOLUONG_PH = req.body.SOLUONG_PH;
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        MS_DN = N'${MS_DN}', 
                        MS_CNVCSC = N'${MS_CNVCSC}', 
                        NGAYKY = '${new Date(NGAYKY).toISOString()}', 
                        LAISUAT = ${LAISUAT}, 
                        KYHAN = ${KYHAN}, 
                        NGAY_PH = '${new Date(NGAY_PH).toISOString()}',
                        NGAY_DH = '${new Date(NGAY_DH).toISOString()}',
                        MENHGIA_TP = ${MENHGIA_TP}, 
                        SOLUONG_PH = ${SOLUONG_PH}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}'
                    WHERE SOHD = '${SOHD}' `;
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
        const SOHD = req.body.SOHD;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE SOHD = '${SOHD}'`;
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