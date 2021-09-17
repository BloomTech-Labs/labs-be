export interface IParticipant {
    id: number;
    name: string;
    user_email: string;
}

class Participant implements IParticipant {

    public id: number;
    public name: string;
    public user_email: string;

    constructor (id:number, name:string, user_email:string) {
        this.id = id;
        this.name = name;
        this.user_email = user_email;
    }
}

export default Participant;