#!/bin/sh
if [ `whoami` = root ]; then
    echo Please do not run this script as root or using sudo
    exit
fi

echo "git pull origin master..."
git checkout .
git pull origin master

echo "npm install..."
npm install

echo "npm run build..."
npm run build

echo "Genstart logs2022.a4medier.dk"
pm2 restart logs2022.a4medier-3002
