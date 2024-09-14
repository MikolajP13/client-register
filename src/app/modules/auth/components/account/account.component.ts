import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserDetailsData, UserForm } from '../../../core/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, merge, mergeMap, Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserChangePasswordDialogComponent } from '../user-change-password-dialog/user-change-password-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  private authServcie = inject(AuthService);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private subscriptions = new Subscription();
  private dialog = inject(MatDialog);

  editMode = signal(false);
  userId!: string | undefined;
  userForm!: FormGroup<UserForm>;
  usernameErrorMessage = signal('');
  emailErrorMessage = signal('');

  get controls() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    const formSubscription = this.subscribeUserForm();

    formSubscription.add(() => {
      if (this.userForm) {
        const controlsSubscription = merge(
          this.userForm.controls.username.statusChanges,
          this.userForm.controls.username.valueChanges,
          this.userForm.controls.email.statusChanges,
          this.userForm.controls.email.valueChanges,
        ).subscribe(() => this.updateErrorMessage());

        this.subscriptions.add(controlsSubscription);
      }
    });

    this.subscriptions.add(formSubscription);

    this.destroyRef.onDestroy(() => {
      this.subscriptions.unsubscribe();
    });
  }

  updateErrorMessage() {
    console.log('updating');
    if (this.controls.username.hasError('required')) {
      this.usernameErrorMessage.set('Username is required');
    } else {
      this.usernameErrorMessage.set('');
    }

    if (this.controls.email.hasError('required')) {
      this.emailErrorMessage.set('Email address is required');
    } else if (this.controls.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  toggleEditMode() {
    this.editMode.set(!this.editMode());
    if (this.editMode()) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  cancelChanges() {
    this.toggleEditMode();

    const subscription = this.subscribeUserForm();
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  saveUserData() {
    if (this.userId) {
      const formValues = this.userForm.getRawValue();
      const user: UserDetailsData = {
        id: this.userId,
        ...formValues,
      };

      const subscription = this.userService
        .patchUser(user, this.userId)
        .subscribe({
          next: () => this.subscribeUserForm(),
        });

      this.toggleEditMode();

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(UserChangePasswordDialogComponent, {
      data: this.userId
    })
  }

  private subscribeUserForm() {
    return this.authServcie.user$
      .pipe(
        mergeMap((user) =>
          user ? this.userService.getUserDetails(user.email) : EMPTY,
        ),
      )
      .subscribe({
        next: (userDetails) => {
          this.userId = userDetails?.id;
          this.initUserForm(userDetails);
        },
      });
  }

  private initUserForm(userDetails: UserDetailsData | null) {
    this.userForm = new FormGroup({
      username: new FormControl(userDetails?.username || '', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl(userDetails?.email || '', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      country: new FormControl(userDetails?.country || '', {
        nonNullable: true,
      }),
      city: new FormControl(userDetails?.city || '', { nonNullable: true }),
      phoneNumber: new FormControl(userDetails?.phoneNumber || '', {
        nonNullable: true,
      }),
    });

    this.userForm.disable();
  }
}
