import { Observable } from "rxjs";
import Message from "./Message";
import User from "./User";

export default class Chat {

    private users: Map<string, User> = new Map<string, User>()

    public messages: Message[] = []
    public host_key: string = ''

    constructor() { }

    public isEmpty = () => this.users.size == 0

    public hasUser = (key: string): boolean => this.users.has(key)
    public addUser = (key: string, user: User) => {
        this.users.set(key, user)

        /* Set host if not already set */
        if(!this.host_key) this.host_key = key 
    }
    public deleteUser = (key: string) => {
        if(this.hasUser(key)) {
            this.users.delete(key)

            /* If the host is deleted, change the host to the next player in line */
            if(key === this.host_key) this.host_key = this.users.keys().next().value
        }
    }
    public getUser = (key: string): User | undefined => this.users.get(key) 
    public getUsers = (): Map<string, User> => this.users
    public newUser = (key: string, name: string) => this.addUser(key, new User(key, name) )

}