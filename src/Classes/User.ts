import { getRandomColor, getRandomIndex } from "./Utils";

export default class User {
    constructor(
        public id: string,
        public name: string,
        public color: string = getRandomColor(),
        public imageIndex: number = getRandomIndex(),
        public isTyping: boolean = false
    ) { }
}