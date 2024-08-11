import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authLoadGuard } from './modules/core/guards/auth-load.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./modules/clients/clients.module').then((m) => m.ClientsModule),
    canMatch: [authLoadGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
