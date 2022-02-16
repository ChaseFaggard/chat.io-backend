"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomIndex = exports.getRandomColor = void 0;
const getRandomColor = () => {
    let r = (Math.random() * 127 + 100) >> 0;
    let g = (Math.random() * 127 + 100) >> 0;
    let b = (Math.random() * 127 + 100) >> 0;
    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
};
exports.getRandomColor = getRandomColor;
const getRandomIndex = () => {
    return Math.floor(Math.random() * 45);
};
exports.getRandomIndex = getRandomIndex;
//# sourceMappingURL=Utils.js.map