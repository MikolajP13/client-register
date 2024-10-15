import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Client } from '../../core/models/client.model';
import { MeetingPopupMode } from '../../core/models/meeting.model';

export class ClientValidators {
  static postcode(control: AbstractControl): ValidationErrors | null {
    const postcodePattern = /^\d{2}-\d{3}-\d{1}$/;
    const value = control.value;

    if (!value || postcodePattern.test(value)) {
      return null;
    } else {
      return { invalidPostCode: { value } };
    }
  }

  static clientValidator(clients: Client[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isValid = clients.some(client => client.id === value);
      return isValid ? null : { invalidClient: { value } };
    };
  }
}