import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import {
  Meeting,
  MeetingPopupMode,
  MeetingStatus,
} from '../../core/models/meeting.model';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MeetingDialogComponent } from '../meeting-dialog/meeting-dialog.component';
import { MeetingService } from '../../core/services/meeting.service';
import { merge, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.scss',
})
export class MeetingComponent implements OnInit {
  private meetingService = inject(MeetingService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  clientId = input.required<string>();

  meetings: Meeting[] = [];

  ngOnInit(): void {
    const subscription = this.meetingService.refreshMeetings$
      .pipe(
        startWith({}),
        switchMap(() =>
          this.meetingService.getMeetingsByClientId(this.clientId()),
        ),
      )
      .subscribe({
        next: (meetings) =>
          (this.meetings = meetings.sort(
            (m1, m2) =>
              new Date(m2.date).getTime() - new Date(m1.date).getTime(),
          )),
        error: (err) => console.log('An unexpected error ocurrs: ', err),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onMeetingDetails(meeting: Meeting) {
    const dialogRef = this.dialog.open(MeetingDialogComponent, {
      data: { meeting, clientId: this.clientId(), mode: MeetingPopupMode.Edit },
      width: '600px',
      height: '220px',
    });
  }
}
