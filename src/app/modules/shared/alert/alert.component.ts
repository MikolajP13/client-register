import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alertMessage = input.required<string>();
  alertClass = input<string>('alert-warning');
  
}
