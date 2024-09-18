import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog-header.component.scss'
})
export class DialogHeaderComponent {
  headerTitle = input.required();
  onClose = output();

  closeDialog() {
    this.onClose.emit();
  }
}
