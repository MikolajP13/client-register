import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDetails } from '../../../core/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { confirmPasswordValidator } from '../../../shared/validators/confirm-password.validator';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-change-password-dialog',
  templateUrl: './user-change-password-dialog.component.html',
  styleUrl: './user-change-password-dialog.component.scss',
})
export class UserChangePasswordDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<UserChangePasswordDialogComponent>);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  userId = inject<string>(MAT_DIALOG_DATA);

  hideNewPassword = signal(true);
  hideConfirmNewPassword = signal(true);
  currentPasswordErrorMessage = signal('');
  passwordMatchesErrorMessage = signal('');
  newPasswordErrorMessage = signal('');
  confirmNewPasswordErrorMessage = signal('');

  userPasswordForm = new FormGroup({
    currentPassword: new FormControl('', {
      validators: [Validators.required],
    }),
    passwords: new FormGroup(
      {
        newPassword: new FormControl('', {
          validators: [Validators.required],
        }),
        confirmNewPassword: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      { validators: [confirmPasswordValidator()] },
    ),
  });

  get controls() {
    return this.userPasswordForm.controls;
  }

  ngOnInit(): void {
    const subscirption = merge(
      this.controls.currentPassword.statusChanges,
      this.controls.currentPassword.valueChanges,
      this.controls.passwords.statusChanges,
      this.controls.passwords.valueChanges,
      this.controls.passwords.controls.newPassword.statusChanges,
      this.controls.passwords.controls.newPassword.valueChanges,
      this.controls.passwords.controls.confirmNewPassword.statusChanges,
      this.controls.passwords.controls.confirmNewPassword.valueChanges,
    ).subscribe(() => this.updateErrorMessage());

    this.destroyRef.onDestroy(() => {
      subscirption.unsubscribe();
    });
  }

  updateErrorMessage() {
    if (this.controls.currentPassword.hasError('required')) {
      this.currentPasswordErrorMessage.set('Password is required');
    } else {
      this.currentPasswordErrorMessage.set('');
    }

    if (this.controls.passwords.hasError('invalidPasswords')) {
      this.passwordMatchesErrorMessage.set('Passwords not matches');
    } else {
      this.passwordMatchesErrorMessage.set('');
    }

    if (this.controls.passwords.controls.newPassword.hasError('required')) {
      this.newPasswordErrorMessage.set('New password is required');
    } else {
      this.newPasswordErrorMessage.set('');
    }

    if (
      this.controls.passwords.controls.confirmNewPassword.hasError('required')
    ) {
      this.confirmNewPasswordErrorMessage.set('Confirm password is required');
    } else {
      this.confirmNewPasswordErrorMessage.set('');
    }
  }

  onTogglePasswordField(event: MouseEvent, passwordInputName: string) {
    passwordInputName === 'newPassword'
      ? this.hideNewPasswordInput()
      : this.hideConfirmPasswordInput();
    event.stopPropagation();
  }

  onSubmitPasswordChange() {
    const currentPassword = this.userPasswordForm.getRawValue().currentPassword;
    const newPassword =
      this.userPasswordForm.getRawValue().passwords.newPassword;

    if (currentPassword && newPassword) {
      const subscription = this.userService
        .changeUserPassword(currentPassword, newPassword, this.userId)
        .subscribe({
          next: () => {
            this.closeDialog();
          },
          error: () => {
            alert('Wrong password!');
          },
        });

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private hideNewPasswordInput() {
    this.hideNewPassword.set(!this.hideNewPassword());
  }

  private hideConfirmPasswordInput() {
    this.hideConfirmNewPassword.set(!this.hideConfirmNewPassword());
  }
}
