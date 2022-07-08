export class Message{
    message: string; 
    nick: string;
    date: Date;
    
    constructor(message: string, nick: string, date: Date){
        this.message = message;
        this.nick = nick;
        this.date = date;
    }
    
}
export function objectToJson(message: Message){
    return {
        message:message.message,
        nick: message.nick,        
        date: message.date,

    }
}
export function jsonToMessage(object: any){
    return new Message(object.message, object.nick, object.date)
}