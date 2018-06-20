#!/usr/bin/env node

// data aquired from https://github.com/modood/Administrative-divisions-of-China
const fs = require('fs')

const cities = JSON.parse(fs.readFileSync('./city.json', {encoding: 'utf-8'}))
let provinces = JSON.parse(fs.readFileSync('./province.json', {encoding: 'utf-8'}))

for (let p of provinces) {
    p.districts = []
}

for (let {code, name, provinceCode} of cities) {
    provinces.find(p => p.code === provinceCode).districts.push({code, name})
}

fs.writeFileSync("province-city.js", JSON.stringify(provinces, null, "  "))