import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MeetingNewEdit, MeetingResponse } from '../models/meeting.model';
import { filter, map, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl;
  refreshMeetings$ = new Subject<void>();

  constructor() {}

  getMeetingsByUserId(userId: string) {
    return this.httpClient
      .get<MeetingResponse[]>(`${this.apiUrl}/meetings`)
      .pipe(
        map((response) =>
          response.filter((meeting) => meeting.userId === userId),
        ),
      );
  }

  getMeetingsByClientId(clientId: string) {
    return this.httpClient
      .get<MeetingResponse[]>(`${this.apiUrl}/meetings`)
      .pipe(
        map((response) =>
          response.filter((meeting) => meeting.clientId === clientId),
        ),
      );
  }

  postMeeting(meetingData: MeetingNewEdit) {
    return this.httpClient
      .post<MeetingResponse>(`${this.apiUrl}/meetings`, meetingData)
      .pipe(tap(() => this.refreshMeetings$.next()));
  }

  putMeeting(meetingData: MeetingNewEdit, meetingId: string) {
    return this.httpClient
      .put<MeetingResponse>(`${this.apiUrl}/meetings/${meetingId}`, meetingData)
      .pipe(tap(() => this.refreshMeetings$.next()));
  }

  deleteMeeting(meetingId: string) {
    return this.httpClient
      .delete(`${this.apiUrl}/meetings/${meetingId}`)
      .pipe(tap(() => this.refreshMeetings$.next()));
  }
}
