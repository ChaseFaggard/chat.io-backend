"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http = __importStar(require("http"));
const Chat_1 = __importDefault(require("../../socket-chat/src/app/Classes/Chat"));
const Message_1 = __importDefault(require("../../socket-chat/src/app/Classes/Message"));
class ChatServer {
    constructor() {
        /* Map of Chat instances to their respective lobby names */
        this.chatRooms = new Map(); // All Game instances stored in a map
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    createApp() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    config() {
        this.port = process.env.PORT || ChatServer.PORT;
    }
    sockets() {
        this.io = require('socket.io')(this.server, { cors: { origins: '*' } });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log(`New Client Connected. Id: ${socket.id}`);
            let lobby = '';
            /* Ping check */
            socket.on('ping', () => socket.emit('ping'));
            /* Check if lobby exist */
            socket.on('checklobby', (lobby) => socket.emit('checklobby', this.chatRooms.has(lobby) ? true : false));
            /* Create lobby */
            socket.on('create', () => {
                const lobby = Math.random().toString(36).substring(2, 7); // Generates random lobby name
                /* If lobby doesn't exist and we haven't exceeded max chatRooms allowed, create a new lobby/game */
                if (this.chatRooms.has(lobby) == false && this.chatRooms.size < ChatServer.MAX_ROOMS) {
                    console.log(`New Lobby '${lobby}' created`);
                    this.chatRooms.set(lobby, new Chat_1.default());
                    socket.emit('create', lobby);
                }
                else
                    socket.emit('create');
            });
            /* Join lobby */
            socket.on('join', (data) => {
                if (this.chatRooms.has(data.lobby)) {
                    /* Save lobby */
                    lobby = data.lobby;
                    /* Join socket room */
                    socket.join(lobby);
                    /* Create new user in that game */
                    this.chatRooms.get(lobby).newUser(socket.id, data.name);
                    console.log(`User ${socket.id} joined lobby ${lobby}`);
                    /* Return host and id data back to client */
                    socket.emit('join', this.chatRooms.get(lobby).getUser(socket.id));
                    /* Update everyone in the lobby with the online members */
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]);
                }
                else
                    socket.emit('join'); // Lobby not found
            });
            socket.on('message', (message) => {
                if (lobby) {
                    const msg = new Message_1.default(message, this.chatRooms.get(lobby).getUser(socket.id), new Date().getTime().toString());
                    console.log(`User ${socket.id} sent message: ${msg.message}`);
                    this.io.to(lobby).emit('newMessage', msg);
                }
            });
            socket.on('isTyping', () => {
                this.io.to(lobby).emit('userTyping', socket.id);
            });
            socket.on('stoppedTyping', () => {
                this.io.to(lobby).emit('userStoppedTyping', socket.id);
            });
            socket.on('disconnect', () => {
                console.log(`Client disconnected. ID: ${socket.id}`);
                /* If user was in a lobby/game */
                if (lobby) {
                    console.log(`Client ${socket.id} left lobby ${lobby}`);
                    this.chatRooms.get(lobby).deleteUser(socket.id); // Remove user from game
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]); // Update lobby with online users
                    if (this.chatRooms.get(lobby).isEmpty()) { // Remove lobby if empty
                        console.log(`Deleting lobby '${lobby}' - No users left`);
                        this.chatRooms.delete(lobby);
                    }
                    lobby = '';
                }
            });
            socket.on('disconnected', () => {
                /* If user was in a lobby/game */
                if (lobby) {
                    console.log(`Client ${socket.id} left lobby ${lobby}`);
                    this.chatRooms.get(lobby).deleteUser(socket.id); // Remove user from game
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]); // Update lobby with online users
                    if (this.chatRooms.get(lobby).isEmpty()) { // Remove lobby if empty
                        console.log(`Deleting lobby '${lobby}' - No users left`);
                        this.chatRooms.delete(lobby);
                    }
                    lobby = '';
                }
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ChatServer = ChatServer;
ChatServer.PORT = 8080; // Default local port
ChatServer.MAX_ROOMS = 10; // Max number of rooms
//# sourceMappingURL=ChatServer.js.map