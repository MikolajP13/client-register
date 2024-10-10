import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NoteNewEdit, NoteResponse } from '../models/note.model';
import { map, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl;
  refreshNotes$ = new Subject<void>();

  constructor() {}

  getNotes(clientId: string) {
    return this.httpClient
      .get<NoteResponse[]>(`${this.apiUrl}/notes`)
      .pipe(
        map((response) =>
          response.filter((note) => note.clientId === clientId),
        ),
      );
  }

  postNote(noteData: NoteNewEdit) {
    return this.httpClient
      .post<NoteResponse>(`${this.apiUrl}/notes`, noteData)
      .pipe(tap(() => this.refreshNotes$.next()));
  }

  putNote(noteData: NoteNewEdit, noteId: string) {
    return this.httpClient
      .put<NoteResponse>(`${this.apiUrl}/notes/${noteId}`, noteData)
      .pipe(tap(() => this.refreshNotes$.next()));
  }

  deleteNote(noteId: string) {
    return this.httpClient
      .delete(`${this.apiUrl}/notes/${noteId}`)
      .pipe(tap(() => this.refreshNotes$.next()));
  }
}
