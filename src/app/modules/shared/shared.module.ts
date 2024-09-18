import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { PhoneControlComponent } from './controls/phone-control/phone-control.component';
import { HighlightDirective } from './directives/highlight.directive';
import { UnlessDirective } from './directives/unless.directive';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';

@NgModule({
  declarations: [AlertComponent, PhoneControlComponent, DialogHeaderComponent, HighlightDirective, UnlessDirective],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    PhoneControlComponent,
    HighlightDirective,
    UnlessDirective,
    DialogHeaderComponent
  ],
})
export class SharedModule {}
