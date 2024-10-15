import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingDialogComponent } from './meeting-dialog/meeting-dialog.component';
import { MeetingFormComponent } from './meeting-form/meeting-form.component';
import { DatePipe } from '@angular/common';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [MeetingComponent, MeetingDialogComponent, MeetingFormComponent],
  imports: [ReactiveFormsModule, MaterialModule, DatePipe, SharedModule],
  exports: [MeetingComponent],
})
export class MeetingsModule {}