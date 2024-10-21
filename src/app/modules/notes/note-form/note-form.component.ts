import {
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Note, NoteForm } from '../../core/models/note.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NoteService } from '../../core/services/note.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrl: './note-form.component.scss',
})
export class NoteFormComponent {
  private noteService = inject(NoteService);
  private destroyRef = inject(DestroyRef);
  note = input.required<Note | null>();
  clientId = input.required<string>();
  userId!: string;
  newNoteMode = signal<boolean>(true);
  editNoteMode = signal<boolean>(false);
  closeNoteDialog = output<void>();

  noteForm!: FormGroup<NoteForm>;

  titleErrorMessage = signal('');
  contentErrorMessage = signal('');

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

    const subscription = merge(
      this.noteForm.controls['title'].statusChanges,
      this.noteForm.controls['title'].valueChanges,
      this.noteForm.controls['content'].statusChanges,
      this.noteForm.controls['content'].valueChanges,
    ).subscribe(() => this.updateErrorMessage());

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
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
      next: () => this.emitCloseDialog(),
    });
  }

  updateErrorMessage() {
    if (this.noteForm.controls['title'].hasError('required')) {
      this.titleErrorMessage.set('Title is required');
    } else if (this.noteForm.controls['title'].hasError('minlength')) {
      this.titleErrorMessage.set('Title must contain at least 3 characters');
    } else {
      this.titleErrorMessage.set('');
    }

    if (this.noteForm.controls['content'].hasError('required')) {
      this.contentErrorMessage.set('Content is required');
    } else if (this.noteForm.controls['content'].hasError('minlength')) {
      this.contentErrorMessage.set('Content must contain at least 5 characters');
    } else if (this.noteForm.controls['content'].hasError('maxlength')) {
      this.contentErrorMessage.set('Maximum length of content is 500 characters');
    } else {
      this.contentErrorMessage.set('');
    }
  }

  private initForm() {
    this.noteForm = new FormGroup({
      title: new FormControl(this.newNoteMode() ? '' : this.note()!.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(this.newNoteMode() ? '' : this.note()!.content, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ],
      }),
    });

    this.noteForm.disable();
  }
}
