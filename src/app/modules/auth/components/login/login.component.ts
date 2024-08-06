import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = signal(true);

  loginForm = new FormGroup({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ],
    }),
    password: new FormControl('', {
      validators: Validators.required,
    }),
  });

  onLogin() {
    console.log(this.loginForm.value)
  }

  onTogglePasswordField(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
