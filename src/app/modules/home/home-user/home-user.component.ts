import { Component, inject, input, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MeetingDialogComponent } from '../../meetings/meeting-dialog/meeting-dialog.component';
import { Meeting, MeetingCarousel, MeetingPopupMode } from '../../core/models/meeting.model';
import { MeetingService } from '../../core/services/meeting.service';

interface Product {
  name: string;
  price: number
}

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.scss',
})
export class HomeUserComponent implements OnInit {
  private dialog = inject(MatDialog);
  private meetingService = inject(MeetingService);
  user = input.required<User | null>();
  currentDate = new Date();
  isMeetingToday = signal(false);

  todaysMeetings: MeetingCarousel[] = [];
  responsiveOptions: any[] | undefined;

  ngOnInit(): void {
    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );

    this.meetingService.getTodaysMeetingsByUserId(userData.id).subscribe({
      next: (todaysMeetings) => {
        this.todaysMeetings = todaysMeetings},
    })
  }

  onAddMeeting() {
    const dialogRef = this.dialog.open(MeetingDialogComponent, {
      data: { meeting: null, clientId: null, mode: MeetingPopupMode.New },
      width: '600px',
      height: '400px',
    });
  }
}
