const controls={
    fld:{},
    results:{},
    lbl:{}
};

let ready = false;
let ilsUsd = 3.62;
let ilsEur = 3.84;
let tlv125 = 1765.89;
let snp500 = 3979.13;

const PUBLICLY_HELD_STOCK_VALUE = 715500000000;
const ISRAEL_POPULATION = 9656000;
const AVG_STOCK_PART = 0.15; // how much of the savings are in stocks. Bank of Israel data.
const AVG_FAMILY_SIZE = 3.72;
const AVG_PERSON_YR_SPEND = 91162;
const TLV_125_START = 1815.76;
const SNP_500_START = 3852.97;
const ILS_USD_START = 3.74;
const ILS_EUR_START = 3.527;
const FNX_INFLATION_TRANSMISSION_RATE = 0.2;

const CUR_FORMAT = new Intl.NumberFormat("IW-il", {style:"currency", currency:"ILS", maximumSignificantDigits:3});
const NUM_FORMAT = new Intl.NumberFormat("IW-il", {maximumSignificantDigits:3});

const RATES = {
    usd: "https://www.boi.org.il/roles/markets/%D7%A9%D7%A2%D7%A8%D7%99-%D7%97%D7%9C%D7%99%D7%A4%D7%99%D7%9F-%D7%99%D7%A6%D7%99%D7%92%D7%99%D7%9D/%D7%93%D7%95%D7%9C%D7%A8-%D7%90%D7%9E%D7%A8%D7%99%D7%A7%D7%A0%D7%99/",
    eur: "https://www.boi.org.il/roles/markets/%D7%A9%D7%A2%D7%A8%D7%99-%D7%97%D7%9C%D7%99%D7%A4%D7%99%D7%9F-%D7%99%D7%A6%D7%99%D7%92%D7%99%D7%9D/%D7%90%D7%99%D7%A8%D7%95/"
};

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

    controls.loader = document.getElementById("imgLoader");

    controls.results.familyCost = document.getElementById("yearlyCostFamily");
    controls.results.marketCost = document.getElementById("yearlyCostAll");
    controls.results.familyLoss = document.getElementById("capMarketLossFamily");
    controls.results.marketLoss = document.getElementById("capMarketLossAll");

    // init the monthly spend input to a 3-person family
    controls.fld.monthlySpend.value = Math.round(3*AVG_PERSON_YR_SPEND/12);

    // scrape
    window.setTimeout( ()=>{
        updateScrapedData();
    }, 3000);
}

function updateScrapedData(){
    controls.loader.classList.add("d-none");

    controls.fld.ilsUsd.value = ilsUsd;
    controls.fld.ilsEur.value = ilsEur;
    controls.fld.tlv125.value = tlv125;
    controls.fld.snp500.value = snp500;

    ready = true;
    updateResults();
}

function updateResults() {
    if ( ! ready ) return;

    let familySize = Number(controls.fld.familySize.value);
    let avgSpend = Number(controls.fld.monthlySpend.value);
    let savings =  Number(controls.fld.savings.value);
    
    controls.lbl.familySize.innerHTML = String(familySize);

    // Market Loss
    let tlvChange =  (tlv125/TLV_125_START)-1;
    let snpChange =  (snp500/SNP_500_START)-1;
    let tlvVsSnp  =  (1+tlvChange)/(1+snpChange)-1;
    let totalMarketLoss = PUBLICLY_HELD_STOCK_VALUE*tlvVsSnp;
    let familyMarketLoss = tlvVsSnp*familySize*savings*AVG_STOCK_PART;
    controls.results.familyLoss.innerHTML = CUR_FORMAT.format(-familyMarketLoss);
    controls.results.marketLoss.innerHTML = CUR_FORMAT.format(-totalMarketLoss);

    // Monthly Loss
    let usdChange = ilsUsd/ILS_USD_START-1;
    let eurChange = ilsEur/ILS_EUR_START-1;
    let changeAvg = (usdChange + eurChange)/2;
    let myFamilyLoss = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*avgSpend*12*familySize;
    let avgFamilyLoss = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*AVG_PERSON_YR_SPEND*AVG_FAMILY_SIZE;
    controls.results.familyCost.innerHTML = CUR_FORMAT.format(myFamilyLoss);
    controls.results.marketCost.innerHTML = CUR_FORMAT.format(avgFamilyLoss);
}

