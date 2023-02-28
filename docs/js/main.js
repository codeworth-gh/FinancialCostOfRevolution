const controls={
    fld:{},
    results:{},
    lbl:{}
};



const PUBLICLY_HELD_STOCK_VALUE = 715500000000;
const ISRAEL_POPULATION = 9656000;
const AVG_STOCK_PART = 0.15; // how much of the savings are in stocks. Bank of Israel data.
const AVG_FAMILY_SIZE = 3.72;
const AVG_PERSON_YR_SPEND = 91162;
const TA_125_START = 1815.76;
const GSPC_START = 3852.97;
const ILS_USD_START = 3.527;
const ILS_EUR_START = 3.74;
const FNX_INFLATION_TRANSMISSION_RATE = 0.2;

const CUR_FORMAT = new Intl.NumberFormat("IW-il", {style:"currency", currency:"ILS", maximumSignificantDigits:3});
const NUM_FORMAT = new Intl.NumberFormat("IW-il", {maximumSignificantDigits:3});

function setup(){
    // build controls
    controls.fld.tlv125 = document.getElementById("fldTlv125");
    controls.fld.snp500 = document.getElementById("fldSnP500");
    controls.fld.ilsUsd = document.getElementById("fldIlsUsd");
    controls.fld.ilsEur = document.getElementById("fldIlsEur");
    controls.fld.familySize = document.getElementById("fldFamilySize");
    controls.fld.monthlySpend = document.getElementById("fldMonthlySpend");
    controls.fld.savings = document.getElementById("fldSavedMoney");
    
    controls.lbl.familySize = document.getElementById("lblFamilySize");

    controls.results.avgFamilyLoss = document.getElementById("avgFamilyLoss");
    controls.results.myFamilyLoss = document.getElementById("myFamilyLoss");
    controls.results.avgFamilyCost = document.getElementById("avgFamilyCost");
    controls.results.myFamilyCost = document.getElementById("myFamilyCost");
    
    // init the monthly spend input to a 3-person family
    controls.fld.monthlySpend.value = Math.round(3*AVG_PERSON_YR_SPEND/12);

    updateScrapedData();
}

function updateScrapedData(){
    controls.fld.ilsUsd.value = USD_ILS;
    controls.fld.ilsEur.value = EUR_ILS;
    controls.fld.tlv125.value = TA_125;
    controls.fld.snp500.value = GSPC;

    ready = true;
    updateResults();
}

function updateResults() {
    if ( ! ready ) return;

    let familySize = Number(controls.fld.familySize.value);
    let avgSpend = Number(controls.fld.monthlySpend.value);
    let savings =  Number(controls.fld.savings.value);
    
    controls.lbl.familySize.innerHTML = String(familySize);

    // Cap Market Loss
    let tlvChange =  (TA_125/TA_125_START)-1;
    let snpChange =  (GSPC/GSPC_START)-1;
    let tlvVsSnp  =  (1+tlvChange)/(1+snpChange)-1;
    let totalMarketLoss = PUBLICLY_HELD_STOCK_VALUE*tlvVsSnp;
    let lossPerPerson = totalMarketLoss/ISRAEL_POPULATION;
    let familyMarketLoss = tlvVsSnp*familySize*savings*AVG_STOCK_PART;
    let avgFamilyMarketLoss = lossPerPerson*AVG_FAMILY_SIZE;
    controls.results.avgFamilyLoss.innerHTML = CUR_FORMAT.format(-avgFamilyMarketLoss);
    controls.results.myFamilyLoss.innerHTML = CUR_FORMAT.format(-familyMarketLoss);

    // Yearly Cost
    let usdChange = USD_ILS/ILS_USD_START-1;
    console.log(`usdChange = ${usdChange}`);
    let eurChange = EUR_ILS/ILS_EUR_START-1;
    console.log(`eurChange = ${eurChange}`);
    let changeAvg = (usdChange + eurChange)/2;
    console.log(`changeAvg = ${changeAvg}`);
    let myFamilyLoss = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*avgSpend*12*familySize;
    let avgFamilyLoss = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*AVG_PERSON_YR_SPEND*AVG_FAMILY_SIZE;
    controls.results.avgFamilyCost.innerHTML = CUR_FORMAT.format(avgFamilyLoss);
    controls.results.myFamilyCost.innerHTML = CUR_FORMAT.format(myFamilyLoss);
}
