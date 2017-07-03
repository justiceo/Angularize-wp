#!/bin/bash
tsc rest-api.ts --outDir ./src/app/core/
webpack -p
cp -r angularize_wp /var/www/html/wp-content/plugins/
# echo "copying to dev3"
# scp -r -P1022 angularize_wp justice@dev3.kasomafrica.com:/var/www/dev3.kasomafrica.com/public/wp-content/plugins/
# zip -r angularize_wp.zip angularize_wp