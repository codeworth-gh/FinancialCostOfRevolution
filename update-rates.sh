#!/bin/bash

echo Updating Site
echo =============

RATES_JS_FILE=docs/js/rates.js
RATES_JS_BAK_FILE=docs/js/rates-bak.js
INDEX_FILE=docs/index.html
INDEX_BAK_FILE=docs/index-bak.html

# Read the data from YAHOO
echo Scraping Data
echo =============
GSPC=$(curl https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
TA125=$(curl https://query2.finance.yahoo.com/v8/finance/chart/%5ETA125.TA | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
USDILS=$(curl https://query1.finance.yahoo.com/v8/finance/chart/USDILS=X | jq ".chart.result[0].meta.regularMarketPrice");
sleep $((1 + $RANDOM % 5))
EURILS=$(curl https://query1.finance.yahoo.com/v8/finance/chart/EURILS=X | jq ".chart.result[0].meta.regularMarketPrice");

# Clean up old files
echo Cleaning Up Old Files
echo =====================
[ -e $INDEX_BAK_FILE ] && rm $INDEX_BAK_FILE
[ -e $RATES_JS_BAK_FILE ] && rm $RATES_JS_BAK_FILE
[ -e $RATES_JS_FILE ] && mv $RATES_JS_FILE $RATES_JS_BAK_FILE

# Generate new js file
echo Creating New rates.js
echo =====================
echo const GSPC=$GSPC\; >> $RATES_JS_FILE
echo const TA_125=$TA125\; >> $RATES_JS_FILE
echo const USD_ILS=$USDILS\; >> $RATES_JS_FILE
echo const EUR_ILS=$EURILS\; >> $RATES_JS_FILE
echo const SAMPLE_TIME=\"$(date)\"\; >> $RATES_JS_FILE
echo  >> $RATES_JS_FILE

# Update index.html so browsers won't use the cached value of RATES_JS_FILE
echo Creating New index.html
echo =======================
ANTI_CACHE_NUM=$((1 + $RANDOM % 100000))
ANTI_CACHE_KEY=$(echo __C$(echo $ANTI_CACHE_NUM)C__)

echo New anti-cache key: $ANTI_CACHE_KEY

mv $INDEX_FILE $INDEX_BAK_FILE
sed "s/__C.*C__/$ANTI_CACHE_KEY/" $INDEX_BAK_FILE > $INDEX_FILE

echo =======================
echo  ' ______ '
echo  '< DONE >'
echo  ' ------ '
echo  '       \   ,__,'
echo  '        \  (oo)____'
echo  '           (__)    )\'
echo  '              ||--|| *'
echo =======================
