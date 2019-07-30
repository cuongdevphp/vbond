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

    recipeBondPrice: (k = 0, n, MG, C, Y1, SONGAYTINHLAI) => {
        console.log(k, n, MG, C, Y1, SONGAYTINHLAI); 
        const cp = parseInt(k);
        const mg = parseInt(MG);
        const days = parseInt(n);
        const LSM = parseFloat(C);
        const LSB = parseFloat(Y1);
        console.log((mg + (LSM * cp / SONGAYTINHLAI) + (((LSM - LSB) / 100 ) * mg * days / SONGAYTINHLAI)));
        return (mg + (LSM * cp / SONGAYTINHLAI) + (((LSM - LSB) / 100 ) * mg * days / SONGAYTINHLAI));
    },

    diffDate: (firstDate, secondDate) => {
        const oneDay = 24*60*60*1000;
        firstDate = new Date(firstDate);
        secondDate = new Date(secondDate);
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    },

    reciptKN: (dateBuy, dateF, dateT, expired) => {
        console.log(dateBuy, dateF, dateT, expired);
        let k = 0, n = 0;
        let dateExpired = new Date(moment(dateF, "DD-MM-YYYY").add(expired, 'days').toISOString());
        if(dateBuy <= dateF) {
            let n = diffDate(dateT, dateF);
            return {k, n};
        } else {
            if(dateExpired < dateBuy) {
               return recursiveReciptKN(dateBuy, dateExpired, dateT, expired);
            }
            k = diffDate(dateBuy, dateF) + 1;
            n = diffDate(dateT, dateBuy);
        }
        return {k, n};
    },
    
    lastToken: (token) => {
        const lastToken = token.split('.');
        return lastToken[2];
    }
};

const recursiveReciptKN = (dateBuy, dateExpired, dateT, expired) => {
    return module.exports.reciptKN(dateBuy, dateExpired, dateT, expired);
}

const diffMonth = (dateFrom, dateTo) => {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    return dateTo.getMonth() - dateFrom.getMonth() +  (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
}

const diffD = (firstDate, secondDate) => {
    let a = moment(new Date(firstDate)).format('YYYY-MM-DD');
    let b = moment(new Date(secondDate)).format('YYYY-MM-DD');
    console.log(a, b);
    console.log(a.diff(b, 'days'));
    return a.diff(b, 'days');
}

const dateTimeToDate = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD');
}

const diffDate = (firstDate, secondDate) => {
    let oneDay = 24*60*60*1000;
    firstDate = new Date(moment(new Date(firstDate)).format('YYYY-MM-DD'));
    secondDate = new Date(moment(new Date(secondDate)).format('YYYY-MM-DD'));
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

const dateToTime = (date) => {
    return moment(new Date(date)).format().valueOf();
}