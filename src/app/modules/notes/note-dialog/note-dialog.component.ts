import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrl: './note-dialog.component.scss',
})
export class NoteDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<NoteDialogComponent>);
  data = inject<{note: Note, clientId: string}>(MAT_DIALOG_DATA);

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
