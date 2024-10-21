import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Client,
  ClientForm,
  ClientStatus,
} from '../../../core/models/client.model';
import { merge } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { Router } from '@angular/router';
import { postcodeValidator } from '../../../shared/validators/postcode.validator';
import { ClientValidators } from '../../../shared/validators/client.validators';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  clientForm!: FormGroup<ClientForm>;
  client = input<Client>();
  editMode = input<boolean>(false);
  closeDialog = output<void>();
  userId!: string;
  statuses: { id: number; key: string; label: string }[] = Object.keys(
    ClientStatus,
  ).map((k, i) => ({
    id: i,
    key: k,
    label: ClientStatus[k as keyof typeof ClientStatus],
  }));

  firstnameErrorMessage = signal('');
  lastnameErrorMessage = signal('');
  phoneErrorMessage = signal('');
  emailErrorMessage = signal('');
  countryErrorMessage = signal('');
  cityErrorMessage = signal('');
  streetErrorMessage = signal('');
  postcodeErrorMessage = signal('');
  companyErrorMessage = signal('');
  sectorErrorMessage = signal('');
  statusErrorMessage = signal('');

  get controls() {
    return this.clientForm.controls;
  }

  ngOnInit(): void {
    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );

    this.userId = userData.id;

    this.initForm();

    const subscription = merge(
      this.controls.firstname.statusChanges,
      this.controls.firstname.valueChanges,
      this.controls.lastname.statusChanges,
      this.controls.lastname.valueChanges,
      this.controls.email.statusChanges,
      this.controls.email.valueChanges,
      this.controls.phone.statusChanges,
      this.controls.phone.valueChanges,
      this.controls.country.statusChanges,
      this.controls.country.valueChanges,
      this.controls.city.statusChanges,
      this.controls.city.valueChanges,
      this.controls.postcode.statusChanges,
      this.controls.postcode.valueChanges,
      this.controls.company.statusChanges,
      this.controls.company.valueChanges,
      this.controls.sector.statusChanges,
      this.controls.sector.valueChanges
    ).subscribe(() => this.updateErrorMessage());

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onAddClient() {
    if (this.editMode()) {
      this.clientsService
        .putClient(
          { ...this.clientForm.getRawValue(), userId: this.userId },
          this.client()!.id,
        )
        .subscribe({
          next: () => {
            this.emitCloseDialog();
            this.router.navigate(['/clients']);
          },
          error: (error) => console.log(error),
        });
    } else {
      this.clientsService
        .postClient({
          ...this.clientForm.getRawValue(),
          userId: this.userId,
          status: ClientStatus.New,
        })
        .subscribe({
          next: () => {
            this.clientForm.markAsPristine();
            this.router.navigate(['/clients']);
          },
          error: (error) => console.log(error),
        });
    }
  }

  emitCloseDialog() {
    this.closeDialog.emit();
  }

  updateErrorMessage() {
    if (this.controls.firstname.hasError('required')) {
      this.firstnameErrorMessage.set('Firstname is required');
    } else if (this.controls.firstname.hasError('minlength')) {
      this.firstnameErrorMessage.set('Min length is 2');
    } else if (this.controls.firstname.hasError('maxlength')) {
      this.firstnameErrorMessage.set('Max length is 20');
    } else {
      this.firstnameErrorMessage.set('');
    }

    if (this.controls.lastname.hasError('required')) {
      this.lastnameErrorMessage.set('Lastname is required');
    } else if (this.controls.firstname.hasError('minlength')) {
      this.lastnameErrorMessage.set('Min length is 2');
    } else if (this.controls.firstname.hasError('maxlength')) {
      this.lastnameErrorMessage.set('Max length is 20');
    } else {
      this.lastnameErrorMessage.set('');
    }

    if (this.controls.email.hasError('required')) {
      this.emailErrorMessage.set('Email address is required');
    } else if (this.controls.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }

    if (this.controls.city.hasError('required')) {
      this.cityErrorMessage.set('City is required');
    } else {
      this.cityErrorMessage.set('');
    }

    if (this.controls.country.hasError('required')) {
      this.countryErrorMessage.set('Country is required');
    } else {
      this.countryErrorMessage.set('');
    }

    if (this.controls.postcode.hasError('required')) {
      this.postcodeErrorMessage.set('Postcode is required');
    } else if (this.controls.postcode.hasError('invalidPostCode')) {
      this.postcodeErrorMessage.set('Postcode is not valid (xx-xxx-x)');
    } else {
      this.postcodeErrorMessage.set('');
    }

    if (this.controls.company.hasError('required')) {
      this.companyErrorMessage.set('Company is required');
    } else {
      this.companyErrorMessage.set('');
    }

    if (this.controls.sector.hasError('required')) {
      this.sectorErrorMessage.set('Sector is required');
    } else {
      this.sectorErrorMessage.set('');
    }
  }

  private initForm() {
    this.clientForm = new FormGroup({
      firstname: new FormControl(
        this.editMode() ? this.client()!.firstname : '',
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ],
          nonNullable: true,
        },
      ),
      lastname: new FormControl(
        this.editMode() ? this.client()!.lastname : '',
        {
          validators: [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ],
          nonNullable: true,
        },
      ),
      phone: new FormControl(this.editMode() ? this.client()!.phone : '', {
        validators: [Validators.required, Validators.minLength(2)],
        nonNullable: true,
      }),
      email: new FormControl(this.editMode() ? this.client()!.email : '', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      country: new FormControl(this.editMode() ? this.client()!.country : '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      city: new FormControl(this.editMode() ? this.client()!.city : '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      street: new FormControl(this.editMode() ? this.client()!.street : '', {
        nonNullable: true,
      }),
      postcode: new FormControl(
        this.editMode() ? this.client()!.postcode : '',
        {
          validators: [Validators.required, ClientValidators.postcode],
          nonNullable: true,
        },
      ),
      company: new FormControl(this.editMode() ? this.client()!.company : '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      sector: new FormControl(this.editMode() ? this.client()!.sector : '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      status: new FormControl(
        this.editMode() ? this.client()!.status : ClientStatus.New,
        {
          nonNullable: true,
        },
      ),
    });
  }
}
