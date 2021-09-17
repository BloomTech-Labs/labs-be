export interface IMeeting {
    uuid: string;
    id: number;
    host_id: string;
    topic: string;
    type: number;
    duration: number;
    timezone: string;
    created_at: string;
    join_url: string;
}

class Meeting implements IMeeting {
    public uuid: string;
    public id: number;
    public host_id: string;
    public topic: string;
    public type: number;
    public duration: number;
    public timezone: string;
    public created_at: string;
    public join_url: string;

    constructor(uuid: string, id: number, host_id: string, topic: string, 
        type: number, duration: number, timezone: string, created_at: string, join_url: string) {
        this.uuid = uuid;
        this.id = id || -1;
        this.host_id = host_id;
        this.topic = topic;
        this.type = type || -1;
        this.duration = duration;
        this.timezone = timezone;
        this.created_at = created_at;
        this.join_url = join_url;
    }
}

export default Meeting;
