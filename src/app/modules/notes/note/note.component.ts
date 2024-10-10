import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Client } from '../../core/models/client.model';
import { Note } from '../../core/models/note.model';
import { NoteService } from '../../core/services/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
})
export class NoteComponent implements OnInit {
  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  userId!: string;
  clientId = input.required<string>();
  client = signal<Client | null>(null);
  notes: Note[] = [];

  ngOnInit(): void {
    const subscription = this.noteService.refreshNotes$
      .pipe(
        startWith({}),
        switchMap(() => this.noteService.getNotes(this.clientId())),
      )
      .subscribe({
        next: (notes) => (this.notes = notes),
        error: (err) => console.log('An unexpected error occured'),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onNoteDetails(note: Note) {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      data: { note, clientId: this.clientId() },
      width: '600px',
      height: '400px',
    });
  }
}
