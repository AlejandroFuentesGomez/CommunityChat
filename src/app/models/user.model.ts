export class User{
    email: string; 
    nick: string;
    name: string;
    surname:string;
    birthdate: Date | any;
    photo: string; 
    token: string;
    
    constructor(email: string, nick: string, name: string, surname: string, birthdate: Date | any, photo:string, token:string){
        this.email = email;
        this.nick = nick;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.photo = photo;
        this.token = token;
    }
    
}
export function objectToJson(user: User){
    return {
        email:user.email,
        nick: user.nick,
        name: user.name,
        surname: user.surname,
        birthdate: user.birthdate,
        photo: user.photo,
        token: user.token

    }
}
export function jsonToUser(object: any){
    return new User(object.email, object.nick, object.name, object.surname, object.birthdate, object.photo, object.token)
}