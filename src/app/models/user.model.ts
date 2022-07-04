export class User{
    email: string; 
    nick: string;
    name: string;
    surname:string;
    birthdate: Date;
    
    constructor(email: string, nick: string, name: string, surname: string, birthdate: Date){
        this.email = email;
        this.nick = nick;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
    }
    
}
export function objectToJson(user: User){
    return {
        email:user.email,
        nick: user.nick,
        name: user.name,
        surname: user.surname,
        birthdate: user.birthdate
    }
}