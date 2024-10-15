import { Component, inject, input, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MeetingDialogComponent } from '../../meetings/meeting-dialog/meeting-dialog.component';
import { MeetingPopupMode } from '../../core/models/meeting.model';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.scss',
})
export class HomeUserComponent implements OnInit {
  private dialog = inject(MatDialog);
  user = input.required<User | null>();
  currentDate = new Date();
  isMeetingToday = signal(false);

  ngOnInit(): void {}

  onAddMeeting() {
    const dialogRef = this.dialog.open(MeetingDialogComponent, {
      data: { meeting: null, clientId: null, mode: MeetingPopupMode.New },
      width: '600px',
      height: '400px',
    });
  }
}
