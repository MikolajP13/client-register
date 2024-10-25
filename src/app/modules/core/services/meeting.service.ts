import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  GetMeetingResponse,
  MeetingCarousel,
  MeetingNewEdit,
  MeetingResponse
} from '../models/meeting.model';
import { forkJoin, map, mergeMap, Observable, Subject, tap } from 'rxjs';
import { ClientsService } from './clients.service';
import { PaginatedResponse } from '../models/server-response.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private clientService = inject(ClientsService);
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

  getMeetings(
    userId: string,
    pageIndex: number,
    itemsPerPage: number,
  ): Observable<GetMeetingResponse> {
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_per_page', itemsPerPage)
      .append('_sort', '-date');

    return this.httpClient
      .get<PaginatedResponse<MeetingResponse>>(`${this.apiUrl}/meetings`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          if (!response.body) return { meetings: [], totalCount: 0 };
          const totalCount = response.body.items;
          const meetings: MeetingResponse[] = response.body.data
            .filter((meeting) => meeting.userId === userId);
          return { meetings, totalCount };
        }),
        mergeMap(({ meetings, totalCount }) =>
          forkJoin(
            meetings.map((meeting) =>
              this.clientService
                .getClient(meeting.clientId)
                .pipe(map((client) => ({ ...meeting, client }))),
            ),
          ).pipe(
            map((meetingsWithClient) => {
              return { meetings: meetingsWithClient, totalCount: totalCount };
            }),
          ),
        ),
      );
  }

  getTodaysMeetingsByUserId(userId: string) {
    const today = new Date();

    return this.httpClient
      .get<MeetingResponse[]>(`${this.apiUrl}/meetings`)
      .pipe(
        map((response) =>
          response.filter(
            (meeting) =>
              meeting.userId === userId &&
              this.dateEquals(new Date(meeting.date), today),
          ),
        ),
        map((meetings) =>
          meetings.sort(
            (d1, d2) =>
              new Date(d1.date).getTime() - new Date(d2.date).getTime(),
          ),
        ),
        mergeMap((meetings) =>
          forkJoin(
            meetings.map((meeting) =>
              this.clientService.getClient(meeting.clientId).pipe(
                map((client) => ({
                  ...meeting,
                  client,
                })),
              ),
            ),
          ),
        ),
        map((meetingsWithClients) =>
          meetingsWithClients.map(
            (meeting) =>
              new MeetingCarousel(
                meeting.id,
                meeting.userId,
                meeting.client,
                meeting.date,
                meeting.status,
              ),
          ),
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

  private dateEquals(date1: Date, date2: Date): boolean {
    return (
      date1.getUTCDate() === date2.getDate() &&
      date1.getUTCMonth() === date2.getMonth() &&
      date1.getUTCFullYear() === date2.getFullYear()
    );
  }
}
