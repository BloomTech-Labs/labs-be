export interface IMeetingInstance {
    uuid: number;
    start_time: string;
  }

class MeetingInstance implements IMeetingInstance {

    public uuid: number;
    public start_time: string;

    constructor(uuid: number, start_time: string) {
        this.uuid = uuid;
        this.start_time = start_time;
    }
}

export default MeetingInstance;