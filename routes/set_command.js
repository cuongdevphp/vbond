var express = require('express');
var header = require('../header');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_DATLENH]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    //header.setHeader(res);
    header.jwtVerify(req, res);
    try {
        const pool = await poolPromise;
        const sql = `SELECT 
                    p.*
                FROM
                    ${tbl} p
                ;
            `;
        const result = await pool.request().query(sql);
        const rs = [];
        // for(const key in result.recordset) {
        //     const data = JSON.parse("[" + result.recordset[0].NGAY_TRAITUC + "]");
        //     rs.push({
                
        //         NGAY_TRAITUC: data
        //     });
        // }
        console.log(result.recordset);
        for (const i = 0; i <= result.recordset.length; i++) {
            const data = JSON.parse("[" + result.recordset[i].NGAY_TRAITUC + "]");
            //console.log(data);
            result.recordset.push({
                test: 'test'
            });
        }
        console.log(rs);
        //console.log(result.recordset);
        //console.log(result.recordset);
        
        //console.log(JSON.parse("[" + result.recordset[0].NGAY_TRAITUC + "]"));
       // return res.json();
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    header.jwtVerify(req, res);
    try {
        const BOND_ID = req.body.BOND_ID;
        const MS_NDT = req.body.MS_NDT;
        const MS_ROOM = req.body.MS_ROOM;
        const MS_NGUOI_GT = req.body.MS_NGUOI_GT;
        const SOLUONG = req.body.SOLUONG;
        const DONGIA = req.body.DONGIA;
        const TONGGIATRI = req.body.TONGGIATRI;
        const LAISUAT_DH = req.body.LAISUAT_DH;
        const NGAY_GD = req.body.NGAY_GD;
        const GHICHU = req.body.GHICHU || '';
        const NGAY_TRAITUC = req.body.NGAY_TRAITUC;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${tbl}
        (BOND_ID, MS_NDT, MS_ROOM,
        MS_NGUOI_GT, SOLUONG, DONGIA, TONGGIATRI, LAISUAT_DH, NGAY_GD, 
        TRANGTHAI_LENH, NGAY_TRAITUC, GHICHU, NGAYTAO, FLAG) VALUES 
        (${BOND_ID}, N'${MS_NDT}', N'${MS_ROOM}', N'${MS_NGUOI_GT}', ${SOLUONG}, ${DONGIA}, ${TONGGIATRI}, ${LAISUAT_DH}, 
        '${new Date(NGAY_GD).toISOString()}', '${0}', '${NGAY_TRAITUC}', N'${GHICHU}',
        '${new Date(Date.now()).toISOString()}', ${1});`
        console.log(sql, "sql");
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
        const MSDL = req.body.MSDL;
        const BOND_ID = req.body.BOND_ID;
        const MS_TP = req.body.MS_TP;
        const MS_NDT = req.body.MS_NDT;
        const MS_ROOM = req.body.MS_ROOM;
        const MS_TRANGTHAI = req.body.MS_TRANGTHAI;
        const MS_LENH = req.body.MS_LENH;
        const TENLOAI_TP = req.body.TENLOAI_TP;
        const MS_NGUOI_GT = req.body.MS_NGUOI_GT;
        const SOLUONG = req.body.SOLUONG;
        const DONGIA = req.body.DONGIA;
        const TONGGIATRI = req.body.TONGGIATRI;
        const LAISUAT_DH = req.body.LAISUAT_DH;
        const NGAY_GD = req.body.NGAY_GD;
        const NGAY_DH = req.body.NGAY_DH;
        const TRANGTHAICHO = req.body.TRANGTHAICHO;
        const GHICHU = req.body.GHICHU;
        const pool = await poolPromise;
        const sql = `UPDATE ${tbl} SET 
                        BOND_ID = ${BOND_ID}, 
                        MS_TP = N'${MS_TP}', 
                        MS_NDT = N'${MS_NDT}', 
                        MS_ROOM = N'${MS_ROOM}', 
                        MS_TRANGTHAI = ${MS_TRANGTHAI}, 
                        MS_LENH = ${MS_LENH}, 
                        TENLOAI_TP = N'${TENLOAI_TP}', 
                        MS_NGUOI_GT = N'${MS_NGUOI_GT}', 
                        SOLUONG = ${SOLUONG}, 
                        DONGIA = ${DONGIA}, 
                        TONGGIATRI = ${TONGGIATRI}, 
                        LAISUAT_DH = ${LAISUAT_DH}, 
                        NGAY_GD = '${new Date(NGAY_GD).toISOString()}',
                        NGAY_DH = '${new Date(NGAY_DH).toISOString()}',
                        GHICHU = N'${GHICHU}', 
                        TRANGTHAICHO = N'${TRANGTHAICHO}', 
                        NGAYUPDATE = '${new Date(Date.now()).toISOString()}' 
                    WHERE MSDL = ${MSDL}`;
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
        const MSDL = req.body.MSDL;
        const sql = `UPDATE ${tbl} SET FLAG = ${0} WHERE MSDL = ${MSDL}`;
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