const express = require('express');
const header = require('../header');
const common = require('../common');
const moment = require('moment');

const { poolPromise } = require('../db');
const router = express.Router();
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';
const tbl_company = '[dbo].[TB_CONGTY]';
const tbl_KHTT = '[dbo].[TB_KYHANTHANHTOAN]';
const tbl_bondType = '[dbo].[TB_LOAITRAIPHIEU]';
const tbl_NTLTN = '[dbo].[TB_NGAYTINHLAITRONGNAM]';
const tbl_contractVCSC = '[dbo].[TB_HOPDONGMUA_VCSC]';
const tbl_roomVCSC = '[dbo].[TB_ROOMVCSC]';
const tbl_interest_rate_buy = '[dbo].[TB_LAISUATMUA]';
const tbl_bond_price = '[dbo].[TB_GIATRITRAIPHIEU]';

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                        p.*, 
                        a.SOHD, 
                        b.TEN_DN, 
                        d.MSKYHANTT, 
                        e.TENLOAI_TP, 
                        f.SONGAYTINHLAI, 
                        g.LS_TOIDA AS LAISUAT_MUA, 
                        g.MSLS AS MSLSM
                    FROM
                        ${tbl_bond} p
                    LEFT JOIN ${tbl_contractVCSC} a ON a.SOHD = p.SO_HD
                    LEFT JOIN ${tbl_company} b ON b.MSDN = p.MS_DN
                    LEFT JOIN ${tbl_KHTT} d ON d.MSKYHANTT = p.MS_KYHANTT
                    LEFT JOIN ${tbl_bondType} e ON e.MSLTP = p.MS_LTP
                    LEFT JOIN ${tbl_NTLTN} f ON f.MSNTLTN = p.MS_NTLTN
                    LEFT JOIN ${tbl_interest_rate_buy} g ON g.BOND_ID = p.BONDID
                    ORDER BY
                        p.BONDID DESC;
                `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', header.verifyToken, async (req, res) => {
    const bondId = req.params.id;
    if(bondId) {
        try {
            const pool = await poolPromise;
            const sql = `SELECT 
                            p.SL_DPH,
                            p.KYHAN,
                            p.BONDID,
                            p.HANMUC_CHO,
                            p.MENHGIA, 
                            p.NGAYPH, 
                            p.NGAYDH, 
                            b.TEN_DN, 
                            p.MSTP, 
                            b.MSDN, 
                            e.TENLOAI_TP, 
                            e.GHICHU AS GHICHU_LTP, 
                            a.DIEUKHOAN_LS, 
                            a.LS_TOIDA AS LAISUAT_MUA,
                            d.LOAI_TT, 
                            f.SONGAYTINHLAI,
                            g.GIATRI_HIENTAI, 
                            c.TRANGTHAI, 
                            c.MSROOM 
                        FROM 
                            ${tbl_bond} p 
                        LEFT JOIN ${tbl_interest_rate_buy} a ON a.BOND_ID = p.BONDID 
                        LEFT JOIN ${tbl_company} b ON b.MSDN = p.MS_DN 
                        LEFT JOIN ${tbl_roomVCSC} c ON c.BOND_ID = p.BONDID 
                        LEFT JOIN ${tbl_KHTT} d ON d.MSKYHANTT = p.MS_KYHANTT 
                        LEFT JOIN ${tbl_bondType} e ON e.MSLTP = p.MS_LTP 
                        LEFT JOIN ${tbl_NTLTN} f ON f.MSNTLTN = p.MS_NTLTN
                        LEFT JOIN ${tbl_bond_price} g ON g.BOND_ID = p.BONDID
                        WHERE BONDID = ${bondId} 
                        ORDER BY 
                            p.BONDID DESC;
            `;
            const result = await pool.request().query(sql);
            return res.json(result.recordset[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        // Body Bond
        const MSTP = req.body.MSTP;
        const SO_HD = req.body.SO_HD;
        const MS_DN = req.body.MS_DN;
        const MS_KYHANTT = req.body.MS_KYHANTT;
        const MS_LTP = req.body.MS_LTP;
        const MS_NTLTN = req.body.MS_NTLTN;
        const LAISUAT_MUA = req.body.LAISUAT_MUA;
        const MAVIETTAT = req.body.MAVIETTAT;
        const TT_TRAIPHIEU = req.body.TT_TRAIPHIEU;
        const MENHGIA = req.body.MENHGIA;
        const SL_PHTD = req.body.SL_PHTD;
        const SL_DPH = req.body.SL_DPH || 0;
        const SL_LH = req.body.SL_LH || 0;
        const SL_TH = req.body.SL_TH || 0;
        const NGAYPH = req.body.NGAYPH;
        const NGAYDH = req.body.NGAYDH;
        const NGAY_KTPH = req.body.NGAY_KTPH;
        const TONGHANMUC_HUYDONG = req.body.TONGHANMUC_HUYDONG;
        const HANMUC_CHO = req.body.HANMUC_CHO;
        const KYHAN = req.body.KYHAN;
        const TT_NIEMYET = req.body.TT_NIEMYET;
        const TS_DAMBAO = req.body.TS_DAMBAO;
        const SL_LUUKY = req.body.SL_LUUKY;

        const month = await common.monthDiff(new Date(), new Date(NGAYDH));
        const pool = await poolPromise;
        const queryDulicateMSTP = `SELECT MSTP FROM ${tbl_bond} WHERE MSTP = '${MSTP}'`;
        
        const rsDup = await pool.request().query(queryDulicateMSTP);
        if(rsDup.recordset.length === 0) {
            try {
                // Body Room VCSC
                const rs = await pool.request().query(`INSERT INTO ${tbl_bond} 
                    (MSTP, SO_HD, MS_DN, MS_KYHANTT, MS_LTP, MS_NTLTN, 
                    MAVIETTAT, TT_TRAIPHIEU, MENHGIA, SL_PHTD, SL_DPH, SL_LH, SL_TH, NGAYPH, 
                    NGAYDH, NGAY_KTPH, TONGHANMUC_HUYDONG, HANMUC_CHO, KYHAN, 
                    TT_NIEMYET, TS_DAMBAO, SL_LUUKY, NGAYTAO, FLAG) VALUES 
                    (N'${MSTP}', N'${SO_HD}', N'${MS_DN}', 
                    N'${MS_KYHANTT}', N'${MS_LTP}', ${MS_NTLTN}, N'${MAVIETTAT}', 
                    N'${TT_TRAIPHIEU}', ${MENHGIA}, ${SL_PHTD}, ${SL_DPH}, ${SL_LH}, ${SL_TH}, 
                    '${moment(NGAYPH).toISOString()}', '${moment(NGAYDH).toISOString()}', 
                    '${moment(NGAY_KTPH).toISOString()}', ${TONGHANMUC_HUYDONG}, ${HANMUC_CHO}, 
                    ${KYHAN}, ${TT_NIEMYET}, N'${TS_DAMBAO}', ${SL_LUUKY}, 
                    '${moment().toISOString()}', ${1});
                    SELECT BONDID FROM ${tbl_bond} WHERE BONDID = SCOPE_IDENTITY();`);

                await pool.request().query(`
                    INSERT INTO ${tbl_roomVCSC} 
                    (BOND_ID, HANMUC, DANGCHO, THANGCONLAI, TRANGTHAI, NGAYTAO, FLAG) VALUES 
                    (${rs.recordset[0].BONDID}, ${TONGHANMUC_HUYDONG}, ${0}, ${month}, ${1}, '${moment().toISOString()}', ${1});
                `);

                await pool.request().query(`
                    INSERT INTO ${tbl_interest_rate_buy} 
                    (BOND_ID, LS_TOIDA, TRANGTHAI, NGAYBATDAU, NGAYKETTHUC, NGAYTAO, FLAG) VALUES 
                    (${rs.recordset[0].BONDID}, ${LAISUAT_MUA}, ${1}, ${moment(NGAYPH).toISOString()}, ${moment(NGAYPH, "DD-MM-YYYY").add((KYHAN * 30), 'days')}, '${moment().toISOString()}', ${1});
                `);
                res.send('Create data successful!');
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(500).json({ error: 'MSTP bị trùng!'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const BONDID = req.body.BONDID;
        const MSTP = req.body.MSTP;
        const SO_HD = req.body.SO_HD;
        const MS_DN = req.body.MS_DN;
        const MS_KYHANTT = req.body.MS_KYHANTT;
        const MS_LTP = req.body.MS_LTP;
        const MS_NTLTN = req.body.MS_NTLTN;
        const MAVIETTAT = req.body.MAVIETTAT;
        const TT_TRAIPHIEU = req.body.TT_TRAIPHIEU;
        const MENHGIA = req.body.MENHGIA;
        const SL_PHTD = req.body.SL_PHTD;
        const SL_DPH = req.body.SL_DPH;
        const SL_LH = req.body.SL_LH;
        const SL_TH = req.body.SL_TH;
        const NGAYPH = req.body.NGAYPH;
        const NGAYDH = req.body.NGAYDH;
        const NGAY_KTPH = req.body.NGAY_KTPH;
        const TONGHANMUC_HUYDONG = req.body.TONGHANMUC_HUYDONG;
        const HANMUC_CHO = req.body.HANMUC_CHO;
        const KYHAN = req.body.KYHAN;
        const TT_NIEMYET = req.body.TT_NIEMYET;
        const TS_DAMBAO = req.body.TS_DAMBAO;
        const SL_LUUKY = req.body.SL_LUUKY;

        const pool = await poolPromise;
        const sql = `UPDATE ${tbl_bond} SET 
                        MSTP = N'${MSTP}', 
                        SO_HD = N'${SO_HD}', 
                        MS_DN = N'${MS_DN}', 
                        MS_KYHANTT = N'${MS_KYHANTT}', 
                        MS_LTP = N'${MS_LTP}', 
                        MS_NTLTN = ${MS_NTLTN}, 
                        MAVIETTAT = N'${MAVIETTAT}', 
                        TT_TRAIPHIEU = N'${TT_TRAIPHIEU}', 
                        MENHGIA = ${MENHGIA}, 
                        SL_PHTD = ${SL_PHTD}, 
                        SL_DPH = ${SL_DPH}, 
                        SL_LH = ${SL_LH}, 
                        SL_TH = ${SL_TH}, 
                        NGAYPH = '${moment(NGAYPH).toISOString()}', 
                        NGAYDH = '${moment(NGAYDH).toISOString()}', 
                        NGAY_KTPH = '${moment(NGAY_KTPH).toISOString()}', 
                        TONGHANMUC_HUYDONG = ${TONGHANMUC_HUYDONG}, 
                        HANMUC_CHO = ${HANMUC_CHO}, 
                        KYHAN = ${KYHAN}, 
                        TT_NIEMYET = ${TT_NIEMYET}, 
                        TS_DAMBAO = N'${TS_DAMBAO}', 
                        SL_LUUKY = ${SL_LUUKY}, 
                        NGAYUPDATE = '${moment().toISOString()}'
                    WHERE BONDID = ${BONDID} `;
        const month = await common.monthDiff(new Date(), new Date(NGAYDH));
        try {
            await pool.request().query(sql);
            await pool.request().query(`
            UPDATE ${tbl_roomVCSC} SET 
                BOND_ID = ${BONDID}, 
                HANMUC = ${TONGHANMUC_HUYDONG}, 
                DANGCHO = ${0}, 
                THANGCONLAI = ${month}, 
                TRANGTHAI = ${1}, 
                NGAYUPDATE = '${moment().toISOString()}'
            WHERE BOND_ID = ${BONDID} 
            `);
            res.send('Update data successfully');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', header.verifyToken, async (req, res) => {
    try {
        const BONDID = req.body.BONDID;
        const sql = `UPDATE ${tbl_bond} SET FLAG = ${0} WHERE BONDID = ${BONDID}`;
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