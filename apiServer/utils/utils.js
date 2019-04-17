'use strict';
let stringRamdom = require('string-random');

exports.generateUserId = function () {
    let randomNum;

    try {
        randomNum = stringRamdom(8);
    } catch (e) {
        console.log(e);
    }
    return randomNum;
};