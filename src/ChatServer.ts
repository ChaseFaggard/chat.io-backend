import express from 'express'
import cors from 'cors'
import * as http from 'http'
import SocketIO from 'socket.io'
import Chat from './Classes/Chat'
import Message from './Classes/Message'

export class ChatServer {

    public static readonly PORT: number = 8080 // Default local port
    public static readonly MAX_ROOMS: number = 10 // Max number of rooms

    private app: express.Application
    private server: http.Server
    private io: SocketIO.Server
    private port: string | number

    /* Map of Chat instances to their respective lobby names */
    private chatRooms: Map<string, Chat> = new Map<string, Chat>() // All Game instances stored in a map


    constructor() {
        this.createApp()
        this.config()
        this.createServer()
        this.sockets()
        this.listen()
    }

    private createApp(): void {
        this.app = express()
        this.app.use(cors())
    }

    private createServer(): void {
        this.server = http.createServer(this.app)
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT
    }

    private sockets(): void {
        this.io = require('socket.io')(this.server, { cors: { origins: '*' } })
    }

    private listen(): void {

        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port)
        })

        this.io.on('connect', (socket: any) => {
            console.log(`New Client Connected. Id: ${socket.id}`)

            let lobby: string = ''

            /* Ping check */
            socket.on('ping', () => socket.emit('ping'))

            /* Check if lobby exist */
            socket.on('checklobby', (lobby: string) => socket.emit('checklobby', this.chatRooms.has(lobby) ? true : false))

            /* Create lobby */
            socket.on('create', () => {

                const lobby = Math.random().toString(36).substring(2, 7) // Generates random lobby name

                /* If lobby doesn't exist and we haven't exceeded max chatRooms allowed, create a new lobby/game */
                if (this.chatRooms.has(lobby) == false && this.chatRooms.size < ChatServer.MAX_ROOMS) {
                    console.log(`New Lobby '${lobby}' created`)
                    this.chatRooms.set(lobby, new Chat())
                    socket.emit('create', lobby)
                } else socket.emit('create')

            })

            /* Join lobby */
            socket.on('join', (data: { name: string, lobby: string }) => {
    
                if(this.chatRooms.has(data.lobby)) {

                    /* Save lobby */
                    lobby = data.lobby
                    
                    /* Join socket room */
                    socket.join(lobby)

                    /* Create new user in that game */
                    this.chatRooms.get(lobby).newUser(socket.id, data.name)

                    console.log(`User ${socket.id} joined lobby ${lobby}`)

                    /* Return host and id data back to client */
                    socket.emit('join', this.chatRooms.get(lobby).getUser(socket.id))

                    /* Update everyone in the lobby with the online members */
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]) 

                }
                else socket.emit('join') // Lobby not found

            })

            socket.on('message', (message: string) => {
                if(lobby) {
                    const msg = new Message(message, this.chatRooms.get(lobby).getUser(socket.id), new Date().getTime().toString())
                    console.log(`User ${socket.id} sent message: ${msg.message}`)
                    this.io.to(lobby).emit('newMessage', msg)
                }   
            })

            socket.on('isTyping', () => {
                this.io.to(lobby).emit('userTyping', socket.id)
            })

            socket.on('stoppedTyping', () => {
                this.io.to(lobby).emit('userStoppedTyping', socket.id)
            })

            socket.on('disconnect', () => {
                console.log(`Client disconnected. ID: ${socket.id}`)

                /* If user was in a lobby/game */
                if(lobby) {
                    console.log(`Client ${socket.id} left lobby ${lobby}`)

                    this.chatRooms.get(lobby).deleteUser(socket.id) // Remove user from game
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]) // Update lobby with online users
                    
                    if(this.chatRooms.get(lobby).isEmpty()) { // Remove lobby if empty
                        console.log(`Deleting lobby '${lobby}' - No users left`)
                        this.chatRooms.delete(lobby)
                    }

                    lobby = ''
                }
            }) 

            socket.on('disconnected', () => {
                /* If user was in a lobby/game */
                if(lobby) {
                    console.log(`Client ${socket.id} left lobby ${lobby}`)

                    this.chatRooms.get(lobby).deleteUser(socket.id) // Remove user from game
                    this.io.to(lobby).emit('all users', [...this.chatRooms.get(lobby).getUsers()]) // Update lobby with online users
                    
                    if(this.chatRooms.get(lobby).isEmpty()) { // Remove lobby if empty
                        console.log(`Deleting lobby '${lobby}' - No users left`)
                        this.chatRooms.delete(lobby)
                    }

                    lobby = ''
                }
            })
            
        })


    }

    public getApp(): express.Application {
        return this.app
    }
}





