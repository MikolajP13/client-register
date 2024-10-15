import { Component, inject, OnInit } from '@angular/core';
import { Meeting, MeetingPopupMode } from '../../core/models/meeting.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting-dialog',
  templateUrl: './meeting-dialog.component.html',
  styleUrl: './meeting-dialog.component.scss',
})
export class MeetingDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<MeetingDialogComponent>);
  data = inject<{ meeting: Meeting; clientId: string; mode: MeetingPopupMode }>(
    MAT_DIALOG_DATA,
  );

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
