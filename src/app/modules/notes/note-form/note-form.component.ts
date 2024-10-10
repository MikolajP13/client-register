import { Component, inject, input, output, signal } from '@angular/core';
import { Note, NoteForm } from '../../core/models/note.model';
import { FormGroup, FormControl } from '@angular/forms';
import { NoteService } from '../../core/services/note.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent {
  private noteService = inject(NoteService);
  note = input.required<Note | null>();
  clientId = input.required<string>();
  userId!: string;
  newNoteMode = signal<boolean>(true);
  editNoteMode = signal<boolean>(false);
  closeNoteDialog = output<void>();

  noteForm!: FormGroup<NoteForm>;

  ngOnInit(): void {
    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );
    this.userId = userData.id;

    if (this.note()) {
      this.newNoteMode.set(!this.newNoteMode());
      this.initForm();
      this.editNoteMode.set(true);
    } else {
      this.initForm();
      this.noteForm.enable();
    }
  }

  emitCloseDialog() {
    this.closeNoteDialog.emit();
  }

  toggleEditMode() {
    if (this.editNoteMode()) this.noteForm.enable();
    else this.noteForm.disable();

    this.editNoteMode.set(!this.editNoteMode());
  }

  onAddNote() {
    if (this.newNoteMode() && !this.editNoteMode()) {
      this.noteService
        .postNote({
          ...this.noteForm.getRawValue(),
          userId: this.userId,
          clientId: this.clientId(),
          createdDate: new Date(Date.now()),
        })
        .subscribe({
          next: () => this.emitCloseDialog(),
        });
    } else {
      this.noteService
        .putNote(
          {
            ...this.noteForm.getRawValue(),
            userId: this.userId,
            clientId: this.clientId(),
            createdDate: this.note()!.createdDate,
          },
          this.note()!.id,
        )
        .subscribe({
          next: () => this.emitCloseDialog(),
        });
    }
  }

  onDelete() {
    this.noteService.deleteNote(this.note()!.id).subscribe({
      next: () => this.emitCloseDialog()
    })
  }

  private initForm() {
    this.noteForm = new FormGroup({
      title: new FormControl(this.newNoteMode() ? '' : this.note()!.title, {
        nonNullable: true,
      }),
      content: new FormControl(this.newNoteMode() ? '' : this.note()!.content, {
        nonNullable: true,
      }),
    });

    this.noteForm.disable();
  }
}
