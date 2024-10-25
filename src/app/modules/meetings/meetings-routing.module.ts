import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingTableComponent } from './meeting-table/meeting-table.component';
import { authActivateGuard } from '../core/guards/auth-activate.guard';

const routes: Routes = [
  {
    path: '',
    component: MeetingTableComponent,
    canActivate: [authActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingsRoutingModule {}
