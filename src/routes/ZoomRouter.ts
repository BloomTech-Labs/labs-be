import { Request, Response } from "express";
import ZoomMeetingInstanceParticipantsDao from "@daos/Zoom/ZoomMeetingInstanceParticipantsDao";

const zoomMeetingInstanceParticipantsDao = new ZoomMeetingInstanceParticipantsDao();

export interface IZoomRouter {
    emailId: string;
    meetings: Array<any>;
}

class ZoomRouter implements IZoomRouter {
    public emailId: string;
    public meetings: Array<any>;

    constructor(emailId:string) {
        this.emailId = emailId;
        this.meetings = [];
    }

    public async getZoomMeetingsbyEmailId(emailId: string) {
        const meetings = await zoomMeetingInstanceParticipantsDao.getMeetings(emailId);
        return meetings;
    }

    public async getZoomMeetingInstancesbyMeetingId(meetingId: string) {
        const instances = await zoomMeetingInstanceParticipantsDao.getMeetingInstances(meetingId);
        return instances;
    }

    public async getZoomMeetingInstanceParticipantsbyInstanceId(instanceId: string) {
        const participants = await zoomMeetingInstanceParticipantsDao.getMeetingInstanceParticipants(instanceId);
        return participants;
    }

    public filterMeetings(meetings: Array<any> | undefined, property: string, value: any) {
        if (value instanceof Date) {
            meetings!.filter((meeting: any) => {
                const meetingDate = new Date(meeting.created_at);
                return meetingDate.toDateString() == (value as Date).toDateString();
            })
        }
        else {
            return meetings!.filter((meeting: any) => meeting[property] == value);
        }
    }

    public groupMeetingsbyTopic (meetings: Array<any> | undefined, keyword: string) {
        const output: Array<any> = [];
        meetings!.forEach((meeting) => {
            if (meeting.topic.includes(keyword)) {
                output.push(meeting)
            }
        })
        return output;
    }

    public makeListofInstances(meetings: Array<any> | undefined) {
        const instances: Array<any> = [];
        meetings?.forEach((meeting) => {
            const meetingId = meeting.meetingId;
            this.getZoomMeetingInstancesbyMeetingId(meetingId).then(res => {
                instances.push(...res);
            }); 
        });
        return instances;
    }

    public makeListofParticipants(instances: Array<any> | undefined) {
        const participants: Array<any> = [];
        instances?.forEach((instance) => {
            const instanceId = instance.instanceId;
            this.getZoomMeetingInstanceParticipantsbyInstanceId(instanceId).then(res => {
                participants.push(...res);
            });
        });
        return participants;
    }

    public getDailyParticipantReport(emailId: string) {
        // get list of meetings using an emailId
        let meetings!: Array<any>;
        this.getZoomMeetingsbyEmailId(emailId).then(res => {
            res = meetings;
        });
        // filter the meetings by the type of meeting
        // Goal: To remove any meetings besides Standing meetings 
        const standingMeetings = this.filterMeetings(meetings, "type", 3);
        // filter the meetings by the date of the meeting
        // Goal: Filter to get every meeting that happened yesterday
        const currentDay = new Date;
        const currentStandingMeetings = this.filterMeetings(standingMeetings, "created_at", currentDay.setDate(-1));
        // group the meetings by keyword in topic
        // Goal: Distinguish between Product Review and Stakeholder Meetings
        const currentStakeholderMeetings = this.groupMeetingsbyTopic(currentStandingMeetings, 'stakeholder');
        const currentProductReviews = this.groupMeetingsbyTopic(currentStandingMeetings, 'product review');
        // get instances for each type of meeting
        const instancesStakeholder = this.makeListofInstances(currentStakeholderMeetings);
        const instancesProductReview = this.makeListofInstances(currentProductReviews);
        // get participants using instanceIds
        const participantsProductReview = this.makeListofParticipants(instancesProductReview);
        const participantsStakeholder = this.makeListofParticipants(instancesStakeholder);
        // produce Daily Participant Report
        let dailyParticipantReport!: string;
        participantsProductReview.forEach((participant) => {
            const temp = `Product Review; ${participant.name}; ${participant.emailId}. \n`;
            dailyParticipantReport.concat(temp)
        });
        participantsStakeholder.forEach((participant) => {
            const temp = `Stakeholder Meeting; ${participant.name}; ${participant.emailId}. \n`;
            dailyParticipantReport.concat(temp)
        });
        return dailyParticipantReport;
    }
}

export default ZoomRouter;