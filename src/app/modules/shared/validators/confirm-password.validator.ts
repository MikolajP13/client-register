import { AbstractControl, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(): ValidatorFn {
  return (
    control: AbstractControl,
  ): { [key: string]: { newPassword: string } } | null => {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      return { invalidPasswords: newPassword };
    } else {
      return null;
    }
  };
}
