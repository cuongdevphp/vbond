const express = require('express');
const header = require('../header');
const common = require('../common');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();

const { 
    setCommandTbl, 
    bondTbl, 
    investorsTbl, 
    assetTbl, 
    interestYearTbl, 
    roomVcscTbl, 
    interestBuyTbl, 
    historyTbl 
} = require('../tbl');

/* GET listing. */
router.get('/:status', header.verifyToken, async (req, res) => {
    const status = req.params.status || '';
    try {
        const pool = await poolPromise;
        const sql = `SELECT 
                    p.*,
                    a.MSTP,
                    b.TENNDT
                FROM
                    ${setCommandTbl} p
                LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
                LEFT JOIN ${investorsTbl} b ON b.MSNDT = p.MS_NDT 
                ${(status) ? `WHERE TRANGTHAI_LENH = ${status}` : ''} 
                ORDER BY
                    p.MSDL DESC;
            ;`;
        const result = await pool.request().query(sql);
        result.recordset.forEach((v) => {
            v.NGAY_TRAITUC = JSON.parse(v.NGAY_TRAITUC)
        });
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Admin approve
router.put('/updateStatus', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;

        const MSDL = req.body.MSDL;
        const status = req.body.status;
        const MSTS = req.body.MSTS;
        
        try {
            const fetchCommand = await pool.request().query(`
                SELECT p.MS_NDT, p.BOND_ID, p.NGAY_GD, p.SOLUONG, p.DONGIA, p.MSDL, p.TONGGIATRI, p.TRANGTHAI_MUA, 
                    a.NGAYPH, a.NGAYDH, a.SL_DPH,
                    b.SONGAYTINHLAI,
                    c.SOLUONG AS SOLUONGTS,
                    d.LS_TOIDA AS LAISUAT_MUA,
                    e.MSNDT
                FROM ${setCommandTbl} p 
                LEFT JOIN ${bondTbl} a ON a.BONDID = p.BOND_ID
                LEFT JOIN ${interestYearTbl} b ON a.MS_NTLTN = b.MSNTLTN
                LEFT JOIN ${assetTbl} c ON c.MS_DL = p.MSDL 
                LEFT JOIN ${interestBuyTbl} d ON a.BONDID = d.BOND_ID
                LEFT JOIN ${investorsTbl} e ON e.MSNDT = p.MS_NDT 
                WHERE MSDL = ${MSDL}`
            );
            const rsData = fetchCommand.recordset[0];
            switch(status) {
                case 1: 
                    const day = await common.genTotalDateHolding(
                        rsData.NGAY_GD, 
                        rsData.NGAYPH,
                        rsData.NGAYDH,
                        rsData.SONGAYTINHLAI
                    );
                    await pool.request().query(`
                        INSERT INTO ${assetTbl} 
                        (MS_NDT, MS_DL, BOND_ID, LAISUATKHIMUA, 
                        SONGAYNAMGIU, NGAYMUA, SOLUONG, DONGIA, TONGGIATRI, SL_KHADUNG, SL_DABAN, GIATRIKHIBAN, 
                        LAISUATKHIBAN, TRANGTHAI, CAPGIAY_CN, NGAYTAO, FLAG) VALUES 
                        (N'${rsData.MS_NDT}', N'${rsData.MSDL}', ${rsData.BOND_ID}, 
                        ${rsData.LAISUAT_MUA}, ${day}, '${moment().toISOString()}', ${rsData.SOLUONG}, ${rsData.DONGIA}, 
                        ${rsData.TONGGIATRI}, ${rsData.SOLUONG}, ${0}, ${0}, 
                        ${0}, ${1}, ${1}, '${moment().toISOString()}', ${1});
                    `);
                    const exceptBondQuatity = rsData.SL_DPH - rsData.SOLUONG;
                    await pool.request().query(`
                        UPDATE ${bondTbl} SET 
                            SL_DPH = ${exceptBondQuatity}, 
                            NGAYUPDATE = '${moment().toISOString()}' 
                        WHERE BONDID = ${rsData.BOND_ID}`
                    );
                    await pool.request().query(`
                        UPDATE ${roomVcscTbl} SET 
                        DANGCHO = DANGCHO - ${rsData.SOLUONG} 
                        WHERE BOND_ID = ${rsData.BOND_ID}
                    `);
                    break;
                case 3: 
                    const SLDPH = rsData.SOLUONGTS + rsData.SL_DPH;
                    await pool.request().query(`
                        UPDATE ${assetTbl} SET 
                            SOLUONG = ${0}, 
                            NGAYUPDATE = '${moment().toISOString()}' 
                        WHERE MSTS = ${MSTS}`
                    );
                    await pool.request().query(`
                        UPDATE ${bondTbl} SET 
                            SL_DPH = ${SLDPH}, 
                            NGAYUPDATE = '${moment().toISOString()}' 
                        WHERE BONDID = ${rsData.BOND_ID}`
                    );
                    await pool.request().query(`
                        UPDATE ${roomVcscTbl} SET 
                        DANGCHO = DANGCHO - ${rsData.SOLUONG} 
                        WHERE BOND_ID = ${rsData.BOND_ID}
                    `);
                    break;
                default:
                    break;
            }

            await pool.request().query(`
                UPDATE ${setCommandTbl} SET 
                    TRANGTHAI_LENH = ${status}
                WHERE MSDL = ${MSDL}`
            );
            
            await pool.request().query(`
                INSERT INTO ${historyTbl}
                (MS_DL, BOND_ID, TRANGTHAI, MS_NDT, NGAYTAO) VALUES 
                (${MSDL}, ${rsData.BOND_ID}, ${status}, N'${rsData.MS_NDT}', '${moment().toISOString()}');`
            );

            res.status(200).json({ message: 'Duyệt lệnh thành công' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// User buy
router.post('/', header.verifyToken, async (req, res) => {
    try {
        const BOND_ID = req.body.BOND_ID;
        const MS_NDT = req.body.MS_NDT;
        const MS_ROOM = req.body.MS_ROOM;
        const MS_NGUOI_GT = req.body.MS_NGUOI_GT;
        const TONGGIATRITRUOCPHI = req.body.TONGGIATRITRUOCPHI || 0;
        const SOLUONG = req.body.SOLUONG;
        const DONGIA = req.body.DONGIA;
        const TONGGIATRI = req.body.TONGGIATRI;
        const LAISUAT_DH = req.body.LAISUAT_DH;
        const NGAY_GD = req.body.NGAY_GD;
        const GHICHU = req.body.GHICHU || '';
        const NGAY_TRAITUC = req.body.NGAY_TRAITUC;
        const TRANGTHAI_MUA = req.body.TRANGTHAI_MUA || 0;

        const pool = await poolPromise;
        const sql = `INSERT INTO ${setCommandTbl}
            (BOND_ID, MS_NDT, MS_ROOM, TONGGIATRITRUOCPHI,
            MS_NGUOI_GT, SOLUONG, DONGIA, TONGGIATRI, LAISUAT_DH, NGAY_GD, 
            TRANGTHAI_LENH, NGAY_TRAITUC, GHICHU, TRANGTHAI_MUA, NGAYTAO, FLAG) VALUES 
            (${BOND_ID}, N'${MS_NDT}', ${MS_ROOM}, ${TONGGIATRITRUOCPHI}, N'${MS_NGUOI_GT}', ${SOLUONG}, ${DONGIA}, ${TONGGIATRI}, ${LAISUAT_DH}, 
            '${moment(NGAY_GD).toISOString()}', '${0}', '${NGAY_TRAITUC}', N'${GHICHU}',
            ${TRANGTHAI_MUA}, '${moment().toISOString()}', ${1});
            SELECT MSDL FROM ${setCommandTbl} WHERE MSDL = SCOPE_IDENTITY();`;
            console.log(sql);
        try {
            const rsSetCommand = await pool.request().query(sql);
            // await pool.request().query(`
            //     UPDATE ${roomVcscTbl} SET 
            //     DANGCHO = DANGCHO + ${SOLUONG} 
            //     WHERE MSROOM = ${MS_ROOM}
            // `);
            await pool.request().query(`
                INSERT INTO ${historyTbl}
                (MS_DL, BOND_ID, TRANGTHAI, MS_NDT, NGAYTAO) VALUES 
                (${rsSetCommand.recordset[0].MSDL}, ${BOND_ID}, ${0}, N'${MS_NDT}', '${moment().toISOString()}');`
            );
            res.send('Create data successful!');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// router.put('/', header.verifyToken, async (req, res) => {
//     try {
//         const MSDL = req.body.MSDL;
//         const BOND_ID = req.body.BOND_ID;
//         const MS_TP = req.body.MS_TP;
//         const MS_NDT = req.body.MS_NDT;
//         const MS_ROOM = req.body.MS_ROOM;
//         const MS_TRANGTHAI = req.body.MS_TRANGTHAI;
//         const MS_LENH = req.body.MS_LENH;
//         const TENLOAI_TP = req.body.TENLOAI_TP;
//         const MS_NGUOI_GT = req.body.MS_NGUOI_GT;
//         const SOLUONG = req.body.SOLUONG;
//         const DONGIA = req.body.DONGIA;
//         const TONGGIATRI = req.body.TONGGIATRI;
//         const LAISUAT_DH = req.body.LAISUAT_DH;
//         const NGAY_GD = req.body.NGAY_GD;
//         const NGAY_DH = req.body.NGAY_DH;
//         const TRANGTHAICHO = req.body.TRANGTHAICHO;
//         const GHICHU = req.body.GHICHU;
//         const pool = await poolPromise;
//         const sql = `UPDATE ${tbl} SET 
//                         BOND_ID = ${BOND_ID}, 
//                         MS_TP = N'${MS_TP}', 
//                         MS_NDT = N'${MS_NDT}', 
//                         MS_ROOM = N'${MS_ROOM}', 
//                         MS_TRANGTHAI = ${MS_TRANGTHAI}, 
//                         MS_LENH = ${MS_LENH}, 
//                         TENLOAI_TP = N'${TENLOAI_TP}', 
//                         MS_NGUOI_GT = N'${MS_NGUOI_GT}', 
//                         SOLUONG = ${SOLUONG}, 
//                         DONGIA = ${DONGIA}, 
//                         TONGGIATRI = ${TONGGIATRI}, 
//                         LAISUAT_DH = ${LAISUAT_DH}, 
//                         NGAY_GD = '${moment(NGAY_GD).toISOString()}',
//                         NGAY_DH = '${moment(NGAY_DH).toISOString()}',
//                         GHICHU = N'${GHICHU}', 
//                         TRANGTHAICHO = N'${TRANGTHAICHO}', 
//                         NGAYUPDATE = '${moment().toISOString()}' 
//                     WHERE MSDL = ${MSDL}`;
//         try {
//             await pool.request().query(sql);
//             res.send('Update data successfully');
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.delete('/', header.verifyToken, async (req, res) => {
    try {
        const MSDL = req.body.MSDL;
        const sql = `UPDATE ${setCommandTbl} SET FLAG = ${0} WHERE MSDL = ${MSDL}`;
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