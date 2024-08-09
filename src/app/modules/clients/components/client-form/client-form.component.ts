import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientForm } from '../../../core/models/client.model';
import { merge } from 'rxjs';
import { ClientsService } from '../../../core/services/clients.service';
import { Router } from '@angular/router';

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

  firstnameErrorMessage = signal('');
  lastnameErrorMessage = signal('');
  emailErrorMessage = signal('');
  phoneErrorMessage = signal('');
  addressErrorMessage = signal('');
  postcodeErrorMessage = signal('');

  get controls() {
    return this.clientForm.controls;
  }

  ngOnInit(): void {
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
      this.controls.address.statusChanges,
      this.controls.address.valueChanges,
      this.controls.postcode.statusChanges,
      this.controls.postcode.valueChanges,
    ).subscribe(() => this.updateErrorMessage());

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onAddClient() {
    this.clientsService.postClient(this.clientForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/clients']),
      error: error => console.log(error)
    })
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

    if (this.controls.phone.hasError('required')) {
      this.phoneErrorMessage.set('Phone number is required');
    } else {
      this.phoneErrorMessage.set('');
    }

    if (this.controls.address.hasError('required')) {
      this.addressErrorMessage.set('Address is required');
    } else {
      this.addressErrorMessage.set('');
    }

    if (this.controls.postcode.hasError('required')) {
      this.postcodeErrorMessage.set('Postcode is required');
    } else {
      this.postcodeErrorMessage.set('');
    }
  }

  private initForm() {
    this.clientForm = new FormGroup({
      firstname: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
        nonNullable: true,
      }),
      lastname: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
        nonNullable: true,
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      phone: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      address: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      postcode: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }
}
