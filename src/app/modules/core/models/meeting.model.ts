import { Client } from "./client.model";

export interface MeetingResponse {
  id: string;
  userId: string;
  clientId: string;
  date: Date;
  status: MeetingStatus;
}

export class Meeting implements MeetingResponse {
  constructor(
    public id: string,
    public userId: string,
    public clientId: string,
    public date: Date,
    public status: MeetingStatus,
  ) {}
}

export class MeetingCarousel {
  constructor(
    public id: string,
    public userId: string,
    public client: Client,
    public date: Date,
    public status: MeetingStatus,
  ) {}
}

export type MeetingNewEdit = Omit<Meeting, 'id'>;

export enum MeetingStatus {
  Scheduled = 'Scheduled',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Canceled = 'Canceled',
  Rescheduled = 'Rescheduled',
  NoShow = 'No show',
}

export enum MeetingPopupMode {
  New = 'New',
  Edit = 'Edit',
}
