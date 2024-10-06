import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientsService } from '../../../core/services/clients.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Client } from '../../../core/models/client.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClientDialogComponent } from './delete-client-dialog/delete-client-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { Meeting } from '../../../core/models/meeting.model';
import { Note } from '../../../core/models/note.model';

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

  openDialog() {
    const dialogRef = this.dialog.open(DeleteClientDialogComponent, {
      data: this.client(),
    });
    dialogRef.updateSize('400px', '200px');
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      data: this.client(),
      width: '600px',
      maxWidth: '600px',
    });
  }
}
