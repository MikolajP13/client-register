import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserLoginData } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = signal(true);
  loginError = signal(false);
  private authService = inject(AuthService);

  loginForm = new FormGroup({
    username: new FormControl('', {
      validators: Validators.required,
    }),
    password: new FormControl('', {
      validators: Validators.required,
    }),
  });

  onLogin() {
    const userLoginData: UserLoginData = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.authService.login(userLoginData).subscribe({
      next: (user) => {
        if (!user) {
          this.loginError.set(true);
        }
      },
      error: (err) => {
        console.log('An unexpected error occured.\n', err);
      },
    });
  }

  onTogglePasswordField(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
