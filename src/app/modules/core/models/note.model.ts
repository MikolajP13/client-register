
export interface NoteResponse {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  content: string;
  createdDate: Date;
}

export class Note implements NoteResponse {
  constructor(
    public id: string,
    public userId: string,
    public clientId: string,
    public title: string,
    public content: string,
    public createdDate: Date,
  ) {}
}

export type NoteNewEdit = Omit<Note, 'id' | 'userId' | 'clientId'>;