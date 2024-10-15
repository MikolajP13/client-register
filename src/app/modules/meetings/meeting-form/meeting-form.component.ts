import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Meeting,
  MeetingPopupMode,
  MeetingStatus,
} from '../../core/models/meeting.model';
import { map, Observable, startWith } from 'rxjs';
import { ClientsService } from '../../core/services/clients.service';
import { Client } from '../../core/models/client.model';
import { ClientValidators } from '../../shared/validators/client.validators';
import { MeetingService } from '../../core/services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrl: './meeting-form.component.scss',
})
export class MeetingFormComponent implements OnInit {
  private clientService = inject(ClientsService);
  private meetingService = inject(MeetingService);
  closeMeetingDialog = output<void>();
  meeting = input.required<Meeting | null>();
  clientId = input.required<string | null>();
  mode = input.required<MeetingPopupMode>();
  popupMode!: string;

  editMode = signal<boolean>(false);
  newMode = signal<boolean>(true);
  userId!: string;

  meetingForm!: FormGroup;

  clients!: Client[];
  filteredClients: Observable<Client[]> | undefined;

  ngOnInit(): void {
    this.popupMode = this.mode().toString();
    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );
    this.userId = userData.id;

    if (this.mode() === MeetingPopupMode.New && this.clientId() === null) {
      this.clientService.getClientsByUserId(this.userId).subscribe({
        next: (clients) => {
          this.clients = clients;
          this.initForm();
        },
        error: (err) => console.log('An unexpected error occurs', err),
      });
    } else if (this.mode() === MeetingPopupMode.Edit && this.meeting()) {
      this.editMode.set(!this.editMode());
      this.initForm();
    } else {
      this.initForm();
    }

    // const subscription = merge(
    //   this.meetingForm.controls['client'].statusChanges,
    //   this.meetingForm.controls['client'].valueChanges,
    // ).subscribe(() => {}
    //   // this.updateErrorMessage()
    // );
  }

  onAddMeeting() {
    const meetingDate = this.meetingDateFormatter();
    if (this.mode() === MeetingPopupMode.Edit) {
      this.meetingService
        .putMeeting(
          {
            userId: this.userId,
            clientId: this.clientId()
              ? this.clientId()
              : this.meetingForm.controls['client'].getRawValue(),
            date: new Date(meetingDate),
            status: this.meeting()!.status,
          },
          this.meeting()!.id,
        )
        .subscribe({
          next: () => this.emitCloseDialog(),
        });
    } else {
      this.meetingService
        .postMeeting({
          userId: this.userId,
          clientId: this.clientId()
            ? this.clientId()
            : this.meetingForm.controls['client'].getRawValue(),
          date: meetingDate,
          status: MeetingStatus.Scheduled,
        })
        .subscribe({
          next: () => this.emitCloseDialog(),
        });
    }
  }

  onDelete() {
    this.meetingService.deleteMeeting(this.meeting()!.id!).subscribe({
      next: () => this.emitCloseDialog(),
    });
  }

  emitCloseDialog() {
    this.closeMeetingDialog.emit();
  }

  toggleEditMode() {}

  getFullname(clientId: string) {
    const client = this.clients.find((client) => client.id === clientId);
    return client ? client.firstname + ' ' + client.lastname : '';
  }

  private meetingDateFormatter(): Date {
    const meetingDate: Date = new Date(this.meetingForm.controls['date'].value);
    const meetingTime: string = this.meetingForm.controls['time'].value;

    const [time, modifier] = meetingTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    const adjustedHours =
      modifier === 'PM' && hours < 12
        ? hours + 12
        : modifier === 'AM' && hours === 12
          ? 0
          : hours;

    meetingDate.setHours(adjustedHours);
    meetingDate.setMinutes(minutes);
    meetingDate.setSeconds(0);

    return meetingDate;
  }

  private initForm() {
    this.meetingForm = new FormGroup({
      client: new FormControl(''),
      date: new FormControl(this.editMode() ? this.meeting()!.date : ''),
      time: new FormControl(
        this.editMode()
          ? new Date(this.meeting()!.date).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
          : '',
      ),
    });

    if (!this.clientId()) {
      this.meetingForm.controls['client'].setValidators([
        Validators.required,
        ClientValidators.clientValidator(this.clients),
      ]);
    }

    this.filteredClients = this.meetingForm.controls[
      'client'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );
  }

  private _filter(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.clients.filter((client) => {
      const fullName = `${client.firstname.toLowerCase()} ${client.lastname.toLowerCase()}`;
      return fullName.includes(filterValue);
    });
  }
}
