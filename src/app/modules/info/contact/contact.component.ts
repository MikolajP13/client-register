import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faInstagramSquare,
  faSquareXTwitter,
  faFacebookSquare,
} from '@fortawesome/free-brands-svg-icons';
import { merge } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  faInstagram = faInstagramSquare;
  faXTwitter = faSquareXTwitter;
  faFacebook = faFacebookSquare;

  fullNameErrorMessage = signal('');
  emailErrorMessage = signal('');
  contactMessageErrorMessage = signal('');

  contactForm = new FormGroup({
    fullName: new FormControl('', {
      validators: [Validators.required],
    }),
    emailAddress: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  get controls() {
    return this.contactForm.controls;
  }

  ngOnInit(): void {
    const subscirption = merge(
      this.controls.fullName.statusChanges,
      this.controls.fullName.valueChanges,
      this.controls.emailAddress.statusChanges,
      this.controls.emailAddress.valueChanges,
      this.controls.message.statusChanges,
      this.controls.message.valueChanges,
    ).subscribe(() => this.updateErrorMessage());

    this.destroyRef.onDestroy(() => {
      subscirption.unsubscribe();
    });
  }

  onSubmit() {
    //send email
    console.log(this.contactForm.getRawValue());
  }

  updateErrorMessage() {
    if (this.controls.fullName.hasError('required')) {
      this.fullNameErrorMessage.set('Full name is required');
    } else {
      this.fullNameErrorMessage.set('');
    }

    if (this.controls.emailAddress.hasError('required')) {
      this.emailErrorMessage.set('Email is required');
    } else if (this.controls.emailAddress.hasError('email')) {
      this.emailErrorMessage.set('Email not valid');
    } else {
      this.emailErrorMessage.set('');
    }

    if (this.controls.message.hasError('required')) {
      this.contactMessageErrorMessage.set('Message is required');
    } else {
      this.contactMessageErrorMessage.set('');
    }
  }
}
