#!/bin/bash
tsc rest-api.ts --outDir ./src/app/providers/
webpack --production
cp -r angularize_wp /var/www/html/wp-content/plugins/
zip -r angularize_wp.zip angularize_wp