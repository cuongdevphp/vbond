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

    monthDiff: (d1, d2) => {
        const months = (d2.getFullYear() - d1.getFullYear()) * 12;
        return months <= 0 ? 0 : months;
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