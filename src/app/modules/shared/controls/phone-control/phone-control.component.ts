import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { combineLatest, merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-phone-control',
  templateUrl: './phone-control.component.html',
  styleUrl: './phone-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PhoneControlComponent,
      multi: true,
    },
  ],
})
export class PhoneControlComponent implements OnInit, ControlValueAccessor {
  private destroyRef = inject(DestroyRef);
  subscription = new Subscription();

  countryCodeErrorMessage = signal<string>('');
  phoneErrorMessage = signal<string>('');

  numberPrefixControl = new FormControl('', {
    validators: [Validators.required, Validators.pattern('^[0-9]{1,3}$')],
  });

  numberControl = new FormControl('', {
    validators: [Validators.required, Validators.maxLength(9)],
  });

  onChange = (value: string | null) => {};
  onTouch = () => {};

  constructor() {
    this.subscription.add(
      combineLatest([
        this.numberPrefixControl.valueChanges,
        this.numberControl.valueChanges,
      ]).subscribe(([prefix, number]) => {
        if (prefix && number) {
          this.onChange(`+${prefix} ${number}`);
        } else {
          this.onChange(null);
        }
      }),
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      merge(
        this.numberPrefixControl.statusChanges,
        this.numberPrefixControl.valueChanges,
        this.numberControl.statusChanges,
        this.numberControl.valueChanges,
      ).subscribe(() => this.updateErrorMessage()),
    );

    this.destroyRef.onDestroy(() => {
      this.subscription.unsubscribe();
    });
  }

  updateErrorMessage() {
    if (this.numberPrefixControl.hasError('required')) {
      this.countryCodeErrorMessage.set('Country code is required');
    } else if (this.numberPrefixControl.hasError('pattern')) {
      this.countryCodeErrorMessage.set('Country code: max 3 digits');
    } else {
      this.countryCodeErrorMessage.set('');
    }

    if (this.numberControl.hasError('required')) {
      this.phoneErrorMessage.set('Phone number is required');
    } else if (this.numberControl.hasError('maxlength')) {
      this.phoneErrorMessage.set('Phone number: max 9 digits');
    } else {
      this.phoneErrorMessage.set('');
    }
  }

  writeValue(value: string): void {
    //+N{2,3}\sN{1,9}
    const prefix = value.replace(/^\+([0-9]{1,3})\s([0-9]{1,9})$/, '$1');
    const number = value.replace(/^\+([0-9]{1,3})\s([0-9]{1,9})$/, '$2');

    this.numberPrefixControl.setValue(prefix);
    this.numberControl.setValue(number);
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.numberPrefixControl.disable();
      this.numberControl.disable();
    } else {
      this.numberPrefixControl.enable();
      this.numberControl.enable();
    }
  }
}
