"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
class User {
    constructor(id, name, color = (0, Utils_1.getRandomColor)(), imageIndex = (0, Utils_1.getRandomIndex)(), isTyping = false) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.imageIndex = imageIndex;
        this.isTyping = isTyping;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map