const stringRandom = require('string-random');
function generateX() {
    return stringRandom(64, {letters:'abcdef'});
}

console.log(generateX());
console.log(generateX());
console.log(generateX());