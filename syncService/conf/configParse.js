"use strict";

const configJson = require('./config.json');
const currentNet = configJson.currentNet;

/*
* Get configuration by chain type.*/
function getConfig(chainType) {
    let ret;
    if(currentNet === "ethTestnet") {
        ret = configJson.ethTestnet;
    }
    return ret;
}

const chainConfig = getConfig(currentNet);
