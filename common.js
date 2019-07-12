const { poolPromise } = require('./db');
const moment = require('moment');

module.exports = {
    //công thức tính gen số ngày nắm giữ
    genTotalDateHolding: async (dateBuy, dateF, dateT, totalDayInterestYear) => {
        const totalYearHoldBond = diffMonth(dateF, dateT)/12;
        const dateFToTime = dateToTime(dateF);
        const dateBuyToTime = dateToTime(dateBuy);
        const lstTmp = totalYearHoldBond*totalDayInterestYear;
    
        if(dateFToTime < dateBuyToTime) {
            const deductHoldBond = diffDate(dateF, dateBuy);
            return lstTmp - deductHoldBond;
        }
        return lstTmp.toFixed();
    },

    monthDiff: (dateFrom, dateTo) => {
        return dateTo.getMonth() - dateFrom.getMonth() +  (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    },

    checkDupData: async (tbl, field, data) => {
        const pool = await poolPromise;
        return await pool.request().query(`SELECT ${field} FROM ${tbl} WHERE ${field} = '${data}'`);
    },

    recipeBondPrice: (k = 0, n, MG, C, Y1) => {
        const MG = parseInt(MG);
        const n = parseInt(n);
        const C = parseFloat(C);
        const Y1 = parseFloat(Y1);

        return (MG + (0) + (((C - Y1) / 100 ) * MG * n / 365));
    },

    diffDate: (firstDate, secondDate) => {
        const oneDay = 24*60*60*1000;
        firstDate = new Date(firstDate);
        secondDate = new Date(secondDate);
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    },
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