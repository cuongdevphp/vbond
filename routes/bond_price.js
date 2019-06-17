var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_GIATRITRAIPHIEU]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM '+ tbl +' ORDER BY [MSGIATRI] DESC');
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const GIATRI_HIENTAI = req.body.GIATRI_HIENTAI;
        const NGAY_AP = req.body.NGAY_AP;
        const NGAY_HH = req.body.NGAY_HH;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (BOND_ID, MS_TP, GIATRI_HIENTAI, NGAY_AP, NGAY_HH, GHICHU, TRANGTHAI, NGAYTAO, FLAG) VALUES 
        (${BOND_ID}, N'${MS_TP}', ${GIATRI_HIENTAI}, '${new Date(Date.now(NGAY_AP)).toISOString()}', '${new Date(Date.now(NGAY_HH)).toISOString()}', N'${GHICHU}', ${TRANGTHAI}, '${new Date(Date.now()).toISOString()}', ${1});`
        try {
            await pool.request().query(sql);
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

        // const queryDulicateMSLS = `SELECT MSLS FROM ${tbl} WHERE MSLS = '${MSLS}'`;
        // const rsDup = await pool.request().query(queryDulicateMSLS);
        // if(rsDup.recordset.length === 0) {
        //     const sql = `INSERT INTO ${tbl}
        //         (MSLS, BOND_ID, MS_TP, MS_LTT, LS_TOIDA, LS_VTH, LS_BIENDO, LS_BINHQUAN, MA_NH01, MA_NH02, MA_NH03, MA_NH04, MA_NH05, GHICHU_TT, NGAYTAO, FLAG) VALUES 
        //         (N'${MSLS}', ${BOND_ID}, N'${MS_TP}', N'${MS_LTT}', ${LS_TOIDA}, ${LS_VTH}, ${LS_BIENDO}, ${LS_BINHQUAN}, N'${MA_NH01}', N'${MA_NH02}', N'${MA_NH03}', N'${MA_NH04}', N'${MA_NH05}', N'${GHICHU_TT}', '${new Date(Date.now()).toISOString()}', ${1});`
        //     try {
        //         await pool.request().query(sql);
        //         res.send('Create data successful!');
        //     } catch (error) {
        //         res.status(500).json({ error: error.message });
        //     }
        // } else {
        //     res.status(500).json({ error: 'MSLS has been duplicate!'});
        // }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const MSGIATRI = req.body.MSGIATRI;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const GIATRI_HIENTAI = req.body.GIATRI_HIENTAI;
        const NGAY_AP = req.body.NGAY_AP;
        const NGAY_HH = req.body.NGAY_HH;
        const GHICHU = req.body.GHICHU;
        const TRANGTHAI = req.body.TRANGTHAI;
        
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        MS_TP = N'${MS_TP}', 
                        GIATRI_HIENTAI = ${GIATRI_HIENTAI}, 
                        NGAY_AP = '${new Date(Date.now(NGAY_AP)).toISOString()}',
                        NGAY_HH = '${new Date(Date.now(NGAY_HH)).toISOString()}',
                        GHICHU = N'${GHICHU}', 
                        TRANGTHAI = ${TRANGTHAI}, 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
                    WHERE MSGIATRI = ${MSGIATRI}`;
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
        const MSGIATRI = req.body.MSGIATRI;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSGIATRI = ${MSGIATRI}`;
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