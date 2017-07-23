#!/bin/bash
cp -r build/* /var/www/html/wp-content/plugins/angularize_wp/
# echo "copying to dev3"
# scp -r -P1022 angularize_wp justice@dev3.kasomafrica.com:/var/www/dev3.kasomafrica.com/public/wp-content/plugins/
# zip -r angularize_wp.zip angularize_wp