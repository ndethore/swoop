#!/bin/sh

mkdir temp
cp manifest.json temp/
cp icon.png temp/

mkdir -p temp/content-script/bin
cp content-script/styles.css temp/content-script/
cp content-script/bin/app.js temp/content-script/bin/

mkdir temp/event-page
# to update when setting up event-page build
cp event-page/fuse.min.js temp/event-page/
cp event-page/index.js temp/event-page/

zip -r archive temp

rm -rf temp
