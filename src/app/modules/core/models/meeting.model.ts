
export interface MeetingResponse {
  id: string;
  userId: string;
  clientId: string;
  noteId: string;
  date: Date;
  status: MeetingStatus;
  rating: string;
}

export class Meeting implements MeetingResponse {
  constructor(
    public id: string,
    public userId: string,
    public clientId: string,
    public noteId: string,
    public date: Date,
    public status: MeetingStatus,
    public rating: string,
  ) { }
}

export type MeetingNewEdit = Omit<Meeting, 'id' | 'userId' | 'clientId' | 'noteId'>

export enum MeetingStatus {
  Scheduled,
  Confirmed,
  InProgress,
  Completed,
  Canceled,
  Rescheduled,
  NoShow
}