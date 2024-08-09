import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { UserRegistrationData } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  hide = signal(true);
  emailErrorMessage = signal('');
  usernameErrorMessage = signal('');
  passwordErrorMessage = signal('');
  private authService = inject(AuthService);

  registrationForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor() {
    merge(
      this.controls.email.statusChanges,
      this.controls.email.valueChanges,
      this.controls.username.statusChanges,
      this.controls.username.valueChanges,
      this.controls.password.statusChanges,
      this.controls.password.valueChanges,
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage()
    );
  }

  ngOnInit(): void {}

  get controls() {
    return this.registrationForm.controls;
  }

  onRegistration() {
    const userData: UserRegistrationData = this.registrationForm.getRawValue();
    this.authService.register(userData).subscribe({
      error: err => console.log(err)
    });
  }

  updateErrorMessage() {
    if (this.controls.email.hasError('required')) {
      this.emailErrorMessage.set('Email address is required');
    } else if (this.controls.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }

    if (this.controls.username.hasError('required')) {
      this.usernameErrorMessage.set('Username is required');
    } else if (this.controls.username.hasError('minlength')) {
      this.usernameErrorMessage.set('Min length is 4');
    } else if (this.controls.username.hasError('maxlength')) {
      this.usernameErrorMessage.set('Max length is 30');
    } else {
      this.usernameErrorMessage.set('');
    }

    if (this.controls.password.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  onTogglePasswordField(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
