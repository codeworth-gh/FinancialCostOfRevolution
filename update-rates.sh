#!/bin/bash

RATES_JS_FILE=docs/js/rates.js
RATES_JS_BAK_FILE=docs/js/rates-bak.js

# Read the data from YAHOO
GSPC=$(curl https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
TA125=$(curl https://query2.finance.yahoo.com/v8/finance/chart/%5ETA125.TA | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
USDILS=$(curl https://query1.finance.yahoo.com/v8/finance/chart/USDILS=X | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
EURILS=$(curl https://query1.finance.yahoo.com/v8/finance/chart/EURILS=X | jq ".chart.result[0].meta.regularMarketPrice");

# Clean up old files
[ -e $RATES_JS_BAK_FILE ] && rm $RATES_JS_BAK_FILE
[ -e $RATES_JS_FILE ] && mv $RATES_JS_FILE $RATES_JS_BAK_FILE

# Generate new js file
echo const GSPC=$GSPC\; >> $RATES_JS_FILE
echo const TA_125=$TA125\; >> $RATES_JS_FILE
echo const USD_ILS=$USDILS\; >> $RATES_JS_FILE
echo const EUR_ILS=$EURILS\; >> $RATES_JS_FILE
echo const SAMPLE_TIME=\"$(date)\"\; >> $RATES_JS_FILE
echo  >> $RATES_JS_FILE

