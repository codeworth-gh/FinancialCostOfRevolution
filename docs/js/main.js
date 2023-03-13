const controls={
    fld:{},
    results:{},
    lbl:{},
    slt:{}
};



const PUBLICLY_HELD_STOCK_VALUE = 715500000000;
const ISRAEL_POPULATION = 9656000;
const AVG_STOCK_PART = 0.15; // how much of the savings are in stocks. Bank of Israel data.
const AVG_FAMILY_SIZE = 3.72;
const AVG_PERSON_YR_SPEND = 91162;
const TA_125_START = 1815.76;
const GSPC_START = 3852.97;
const USD_ILS_START = 3.527;
const EUR_ILS_START = 3.74;
const FNX_INFLATION_TRANSMISSION_RATE = 0.2;

const CUR_FORMAT = new Intl.NumberFormat("IW-il", {style:"currency", currency:"ILS", maximumSignificantDigits:3});
const NUM_FORMAT = new Intl.NumberFormat("IW-il", {maximumSignificantDigits:3});

function setup(){
    // build controls
    controls.fld.monthlySave = document.getElementById("fldMonthlySave");
    
    controls.lbl.monthlySave = document.getElementById("lblMonthlySave");
    
    controls.slt.income = document.getElementById("sltFamilyIncome");
    controls.slt.savings = document.getElementById("sltFamilySavings");

    controls.results.avgFamilyLoss = document.getElementById("avgFamilyLoss");
    controls.results.myFamilyLoss = document.getElementById("myFamilyLoss");
    controls.results.avgFamilyCost = document.getElementById("avgFamilyCost");
    controls.results.myFamilyCost = document.getElementById("myFamilyCost");
    
    updateScrapedData();
}

function formattedStringToNum( str ) {
    return Number(str.replaceAll(/[^0-9]/g,""));
}

function updateScrapedData(){
    document.getElementById("tdTA125").innerHTML=TA_125;
    document.getElementById("tdTA125Start").innerHTML=TA_125_START;
    document.getElementById("tdGspc").innerHTML=GSPC;
    document.getElementById("tdGspcStart").innerHTML=GSPC_START;
    document.getElementById("tdUsdIls").innerHTML=USD_ILS;
    document.getElementById("tdUsdIlsStart").innerHTML=USD_ILS_START;
    document.getElementById("tdEurIls").innerHTML=EUR_ILS;
    document.getElementById("tdEurIlsStart").innerHTML=EUR_ILS_START;
    document.getElementById("tdUpdateDate").innerHTML=SAMPLE_TIME;
    
    ready = true;
    updateResults();
}

function updateResults() {
    if ( ! ready ) return;

    // Cap Market Loss
    let savings =  Number(controls.slt.savings.value);
    
    let tlvChange =  (TA_125/TA_125_START)-1;
    let gspcChange =  (GSPC/GSPC_START)-1;
    let tlvVsSnp  =  (1+tlvChange)/(1+gspcChange)-1;
    let totalMarketLoss = PUBLICLY_HELD_STOCK_VALUE*tlvVsSnp;
    let lossPerPerson = totalMarketLoss/ISRAEL_POPULATION;
    let familyMarketLoss = tlvVsSnp*savings*AVG_STOCK_PART;
    let avgFamilyMarketLoss = lossPerPerson*AVG_FAMILY_SIZE;
    
    controls.results.avgFamilyLoss.innerHTML = NUM_FORMAT.format(-avgFamilyMarketLoss);
    controls.results.myFamilyLoss.innerHTML = CUR_FORMAT.format(-familyMarketLoss);
    updateExplanationPct( ".TA125Change", tlvChange );
    updateExplanationPct( ".gspcChange", gspcChange );
    updateExplanationPct( ".gspcVsTa", tlvVsSnp );
    updateExplanationILS( ".totalMarketLoss", -totalMarketLoss);
    updateExplanationILS( ".lossPerPerson", -lossPerPerson);
    updateExplanationILS( ".avgFamilyLoss", -avgFamilyMarketLoss);
    
    // Yearly Cost
    let monthlyIncome = Number(controls.slt.income.value);
    let monthlySave = Number(controls.fld.monthlySave.value);
    let monthlySavePct = monthlySave/100;
    
    let usdChange = USD_ILS/USD_ILS_START-1;
    let eurChange = EUR_ILS/EUR_ILS_START-1;
    let changeAvg = (usdChange + eurChange)/2;
    let avgFamilyCost = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*AVG_PERSON_YR_SPEND*AVG_FAMILY_SIZE;
    let myFamilyCost = changeAvg*FNX_INFLATION_TRANSMISSION_RATE*(1-monthlySavePct)*monthlyIncome*12;
    
    controls.lbl.monthlySave.innerHTML = "כ-" + String(monthlySave) + "%";
    controls.results.avgFamilyCost.innerHTML = NUM_FORMAT.format(avgFamilyCost);
    controls.results.myFamilyCost.innerHTML = CUR_FORMAT.format(myFamilyCost) + " לשנה";
    updateExplanationPct(".usdChange", usdChange);
    updateExplanationPct(".eurChange", eurChange);
    updateExplanationPct(".changeAvg", changeAvg);
    updateExplanationILS(".avgFamilyCost", avgFamilyCost)
}

function updateExplanationPct( className, number ){
    const fmtStr = NUM_FORMAT.format( number*100 )  + "%";
    document.querySelectorAll(className).forEach( e => e.innerHTML=fmtStr );
}
function updateExplanationILS( className, number ){
    const fmtStr = CUR_FORMAT.format( number );
    document.querySelectorAll(className).forEach( e => e.innerHTML=fmtStr );
}