"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Chat {
    constructor() {
        this.users = new Map();
        this.messages = [];
        this.host_key = '';
        this.isEmpty = () => this.users.size == 0;
        this.hasUser = (key) => this.users.has(key);
        this.addUser = (key, user) => {
            this.users.set(key, user);
            /* Set host if not already set */
            if (!this.host_key)
                this.host_key = key;
        };
        this.deleteUser = (key) => {
            if (this.hasUser(key)) {
                this.users.delete(key);
                /* If the host is deleted, change the host to the next player in line */
                if (key === this.host_key)
                    this.host_key = this.users.keys().next().value;
            }
        };
        this.getUser = (key) => this.users.get(key);
        this.getUsers = () => this.users;
        this.newUser = (key, name) => this.addUser(key, new User_1.default(key, name));
    }
}
exports.default = Chat;
//# sourceMappingURL=Chat.js.map