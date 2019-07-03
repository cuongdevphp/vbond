const { poolPromise } = require('./db');
module.exports = {
    //công thức tính gen số ngày nắm giữ
    genTotalDateHolding: async (dateBuy, dateF, dateT, totalDayInterestYear) => {
        let totalYearHoldBond = diffMonth(dateF, dateT)/12;
        let dateFToTime = dateToTime(dateF);
        let dateBuyToTime = dateToTime(dateBuy);
        let lstTmp = totalYearHoldBond*totalDayInterestYear;
    
        if(dateFToTime < dateBuyToTime){
            let deductHoldBond = diffDate(dateF, dateBuy);
            return lstTmp - deductHoldBond;
        }
        return lstTmp.toFixed();
    },

    monthDiff: (dateFrom, dateTo) => {
        return dateTo.getMonth() - dateFrom.getMonth() +  (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    },

    checkDupData: async (res, tbl, field, data) => {
        const pool = await poolPromise;
        const reDup = await pool.request().query(`SELECT ${field} FROM ${tbl} WHERE ${field} = '${data}'`);
        if(reDup.recordset.length > 0) {
            return res.status(500).json({ error: `${field} bị trùng!` });
        }
    }
};

function diffMonth (dateFrom, dateTo) {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    return dateTo.getMonth() - dateFrom.getMonth() +  (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
}

function diffDate (firstDate, secondDate) {
    let oneDay = 24*60*60*1000;
    firstDate = new Date(firstDate);
    secondDate = new Date(secondDate);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

function dateToTime (date) {
    return moment(new Date(date)).format().valueOf();
}