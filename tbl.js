const db = '[dbo].';
const historyTbl = `${db}[TB_HISTORY]`;
const branchVcscTbl = `${db}[TB_CACCHINHAVCSC]`;
const companyTbl = `${db}[TB_CONGTY]`;
const setCommandTbl = `${db}[TB_DATLENH]`;
const setCommandBuyTbl = `${db}[TB_DATLENMUA]`;
const bondPriceTbl = `${db}[TB_GIATRITRAIPHIEU]`;
const authPageTbl = `${db}[TB_GIAYCHUNGNHAN]`;
const contractTbl = `${db}[TB_HOPDONGMUA_VCSC]`;
const roundPayTbl = `${db}[TB_KYHANTHANHTOAN]`;
const interestSalesTbl = `${db}[TB_LAISUATBAN]`;
const interestBuyTbl = `${db}[TB_LAISUATMUA]`;
const interestBankTbl = `${db}[TB_LAISUATNGANHANG]`;
const interestAgainTbl = `${db}[TB_LAITAIDAUTU]`;
const bondTypeTbl = `${db}[TB_LOAITRAIPHIEU]`;
const interestYearTbl = `${db}[TB_NGAYTINHLAITRONGNAM]`;
const investorsTbl = `${db}[TB_NHADAUTU]`;
const tradeFeeTbl = `${db}[TB_PHIGIAODICH]`;
const prefixTbl = `${db}[TB_PREFIX]`;
const roomInvestorTbl = `${db}[TB_ROOMINVESTOR]`;
const roomVcscTbl = `${db}[TB_ROOMVCSC]`;
const assetTbl = `${db}[TB_TAISAN]`;
const bondTbl = `${db}[TB_TRAIPHIEU]`;
const userTbl = `${db}[TB_USER]`;

module.exports = {
    historyTbl, 
    branchVcscTbl, 
    companyTbl, 
    setCommandTbl, 
    setCommandBuyTbl, 
    bondPriceTbl, 
    authPageTbl, 
    contractTbl, 
    interestSalesTbl, 
    interestBuyTbl, 
    interestBankTbl, 
    interestAgainTbl, 
    bondTypeTbl, 
    interestYearTbl, 
    investorsTbl, 
    tradeFeeTbl, 
    prefixTbl, 
    roomInvestorTbl, 
    roomVcscTbl, 
    assetTbl, 
    bondTbl, 
    userTbl, 
    roundPayTbl
}