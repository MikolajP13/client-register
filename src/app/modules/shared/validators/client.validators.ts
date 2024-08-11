import { AbstractControl, ValidationErrors } from "@angular/forms";

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
}