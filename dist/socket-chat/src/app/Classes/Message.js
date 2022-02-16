"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(message, user, timestamp) {
        this.message = message;
        this.user = user;
        this.timestamp = timestamp;
        this.print = () => `[${this.user.name}]: ${this.message}`;
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map