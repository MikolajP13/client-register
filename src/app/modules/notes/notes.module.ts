import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { NoteComponent } from './note/note.component';
import { NoteFormComponent } from './note-form/note-form.component';

@NgModule({
  declarations: [NoteDialogComponent, NoteComponent, NoteFormComponent],
  imports: [ReactiveFormsModule, MaterialModule, SharedModule],
  exports: [NoteComponent],
})
export class NotesModule {}
