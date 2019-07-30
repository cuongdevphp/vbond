const express = require('express');
const header = require('../header');
const moment = require('moment');
const { poolPromise } = require('../db');
const router = express.Router();

const {
    interestRateNoReturnTbl
} = require('../tbl');

/* GET listing. */
router.get('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const sql = `SELECT
                p.*
            FROM 
                ${interestRateNoReturnTbl} p 
            ORDER BY
                p.THANGGIOIHAN DESC;
        `;
        const result = await pool.request().query(sql);
        return res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', header.verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        
        const LS_TOIDA = req.body.LS_TOIDA;
        const THANGGIOIHAN = req.body.THANGGIOIHAN;

        const checkMonthDup = await pool.request().query(`
            SELECT THANGGIOIHAN 
            FROM ${interestRateNoReturnTbl} 
            WHERE THANGGIOIHAN = ${THANGGIOIHAN}
        `);
        if(checkMonthDup.recordset.length === 0) {
            await pool.request().query(`INSERT INTO ${interestRateNoReturnTbl}
            (LS_TOIDA, THANGGIOIHAN, NGAYTAO, FLAG) VALUES 
            (${LS_TOIDA}, ${THANGGIOIHAN}, '${moment().toISOString()}', ${1});`);
            res.send('Create data successful!');
        } else {
            res.status(500).json({ error: "THANGGIOIHAN bị trùng" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/', header.verifyToken, async (req, res) => {
    try {
        const LAISUAT_ID = req.body.LAISUAT_ID;
        const LS_TOIDA = req.body.LS_TOIDA;
        const KIEUDULIEU = req.body.KIEUDULIEU;
        const THANGGIOIHAN = req.body.THANGGIOIHAN;
        
        const pool = await poolPromise;
        switch (KIEUDULIEU) {
            case 1:
                await pool.request().query(`
                UPDATE ${interestRateNoReturnTbl} SET 
                    THANGGIOIHAN = ${THANGGIOIHAN},
                    LS_TOIDA = ${LS_TOIDA}, 
                    NGAYUPDATE = '${moment().toISOString()}' 
                WHERE LAISUAT_ID = ${LAISUAT_ID}`);
                break;
            case 2:
                const rs = await pool.request().query(`
                    SELECT LICHSUCAPNHAT, LS_TOIDA, THANGGIOIHAN 
                    FROM ${interestRateNoReturnTbl} 
                    WHERE LAISUAT_ID = ${LAISUAT_ID}
                `);
                if(rs.recordset[0].LICHSUCAPNHAT === null) {
                    const arrLICHSU = [];
                    arrLICHSU.push({
                        THANG: rs.recordset[0].THANGGIOIHAN,
                        LS: rs.recordset[0].LS_TOIDA, 
                        NT: moment().toISOString()
                    });
                    await pool.request().query(`
                    UPDATE ${interestRateNoReturnTbl} SET 
                        THANGGIOIHAN = ${THANGGIOIHAN},
                        LICHSUCAPNHAT = '${JSON.stringify(arrLICHSU)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE LAISUAT_ID = ${LAISUAT_ID}`);
                } else {
                    const rsLICHSUCAPNHAT = JSON.parse(rs.recordset[0].LICHSUCAPNHAT);
                    
                    rsLICHSUCAPNHAT.push({
                        THANG: rs.recordset[0].THANGGIOIHAN,
                        LS: rs.recordset[0].LS_TOIDA, 
                        NT: moment().toISOString()
                    });
                    await pool.request().query(`
                    UPDATE ${interestRateNoReturnTbl} SET 
                        THANGGIOIHAN = ${THANGGIOIHAN},
                        LICHSUCAPNHAT = '${JSON.stringify(rsLICHSUCAPNHAT)}',
                        LS_TOIDA = ${LS_TOIDA}, 
                        NGAYUPDATE = '${moment().toISOString()}' 
                    WHERE LAISUAT_ID = ${LAISUAT_ID}`);
                }
                break;
            default:
                break;
        }
        res.send('Update data successful!');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/', header.verifyToken, async (req, res) => {
    try {
        const LAISUAT_ID = req.body.LAISUAT_ID;
        const sql = `UPDATE ${interestRateNoReturnTbl} SET FLAG = ${0} WHERE LAISUAT_ID = ${LAISUAT_ID}`;
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