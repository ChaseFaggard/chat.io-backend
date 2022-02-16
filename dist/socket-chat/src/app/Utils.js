"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomColor = exports.binaryToObject = exports.objectToBinary = exports.getRandomInt = void 0;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
exports.getRandomInt = getRandomInt;
const objectToBinary = (obj) => {
    let output = '';
    let input = JSON.stringify(obj);
    for (let i = 0; i < input.length; i++)
        output += input[i].charCodeAt(0).toString(2) + " ";
    return output.trimEnd();
};
exports.objectToBinary = objectToBinary;
const binaryToObject = (str) => {
    var newBin = str.split(" ");
    var binCode = [];
    for (let i = 0; i < newBin.length; i++)
        binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
    let jsonString = binCode.join("");
    return JSON.parse(jsonString);
};
exports.binaryToObject = binaryToObject;
const getRandomColor = () => {
    let r = Math.random() * 255 >> 0;
    let g = Math.random() * 255 >> 0;
    let b = Math.random() * 255 >> 0;
    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
};
exports.getRandomColor = getRandomColor;
//# sourceMappingURL=Utils.js.map