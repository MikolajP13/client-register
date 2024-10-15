import { NgModule } from '@angular/core';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { SharedModule } from '../shared/shared.module';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { ClientComponent } from './components/client/client.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { DeleteClientDialogComponent } from './components/client/delete-client-dialog/delete-client-dialog.component';
import { EditClientDialogComponent } from './components/client/edit-client-dialog/edit-client-dialog.component';
import { NotesModule } from '../notes/notes.module';
import { MeetingsModule } from '../meetings/meetings.module';

@NgModule({
  declarations: [ClientsComponent, ClientsTableComponent, ClientComponent, ClientFormComponent, DeleteClientDialogComponent, EditClientDialogComponent],
  imports: [SharedModule, ClientsRoutingModule, NotesModule, MeetingsModule],
  exports: [],
})
export class ClientsModule {}
