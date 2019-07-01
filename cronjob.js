const cron = require('cron');
const { poolPromise } = require('./db');

const tbl_roomVCSC = '[dbo].[TB_ROOMVCSC]';
const tbl_bond = '[dbo].[TB_TRAIPHIEU]';

const updateBondMonth = async () => {
    try {
        //console.log("test");
        const pool = await poolPromise;
        const sql = `SELECT 
                a.NGAYPH, p.THANGCONLAI 
            FROM 
                ${tbl_roomVCSC} p 
            LEFT JOIN ${tbl_bond} a ON a.BONDID = p.BOND_ID 
        `;
        const result = await pool.request().query(sql);
        //console.log(result.recordset.length);
    } catch (error) {
        //console.log(error);
    }
    // const job = new cron.CronJob({
    //     cronTime: '00 14 16 * * 0-6', // Chạy Jobs vào 23h30 hằng đêm
    //     onTick: function() {
    //         console.log('Cron jub runing...');
    //     },
    //     start: true, 
    //     timeZone: 'Asia/Ho_Chi_Minh' // Lưu ý set lại time zone cho đúng 
    // });
    // job.start();
}

module.exports = {
    updateBondMonth
};