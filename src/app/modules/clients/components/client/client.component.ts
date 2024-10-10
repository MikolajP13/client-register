import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from '../../../core/services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Client } from '../../../core/models/client.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClientDialogComponent } from './delete-client-dialog/delete-client-dialog.component';
import { Meeting } from '../../../core/models/meeting.model';
import { Note } from '../../../core/models/note.model';
import { NoteDialogComponent } from '../../../notes/note-dialog/note-dialog.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit {
  private clientsService = inject(ClientsService);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  client = signal<Client | null>(null);
  meetings = signal<Meeting[]>([]);
  notes = signal<Note[]>([]);

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap((params) => this.clientsService.getClient(params['id'])))
      .subscribe({
        next: (client) => this.client.set(client),
      });
  }

  onAddNote() {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      data: { note: null, clientId: this.client()!.id },
    });
    dialogRef.updateSize('600px', '400px');
  }
}
