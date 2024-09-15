import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeGuestComponent } from './home-guest/home-guest.component';
import { HomeUserComponent } from './home-user/home-user.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeGuestComponent,
    HomeUserComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  exports: []
})
export class HomeModule { }
