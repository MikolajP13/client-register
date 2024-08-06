import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [CommonModule],
  exports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, AlertComponent],
})
export class SharedModule {}
