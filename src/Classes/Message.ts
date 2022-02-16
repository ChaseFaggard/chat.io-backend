import User from "./User"

export default class Message {

    constructor(public message: string, public user: User, public timestamp: string) {}

    print = (): string => `[${this.user.name}]: ${this.message}`

}