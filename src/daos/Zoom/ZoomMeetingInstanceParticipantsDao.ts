import ZoomClient from "@daos/Zoom/ZoomClient";

export interface IZoomMeetingInstanceParticipantsDao {
  getMeetings: (emailId: string) => Promise<any[]>;
  getMeetingInstances: (meetingId: string) => Promise<any[]>;
  getMeetingInstanceParticipants: (instanceId: string) => Promise<any[]>;
}

class ZoomMeetingInstanceParticipantsDao implements IZoomMeetingInstanceParticipantsDao {

  private client: ZoomClient = new ZoomClient();
  /**
   * @param emailId 
   */
  public getMeetingInstanceParticipants(instanceId: string): any {
      let path = `past_meetings/${instanceId}/participants`;
      return this.client.get(path);
  }

  /**
   * @param emailId 
   */
   public getMeetingInstances(meetingId: string): any {
    let path = `past_meetings/${meetingId}/instances`;
    return this.client.get(path);
  }

  /**
   * @param emailId 
   */
   public getMeetings(emailId: string): any {
    let path = `users/${emailId}/meetings`;
    return this.client.get(path);
  }
}

export default ZoomMeetingInstanceParticipantsDao;