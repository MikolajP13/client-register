import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangePasswordDialogComponent } from './user-change-password-dialog.component';

describe('UserChangePasswordDialogComponent', () => {
  let component: UserChangePasswordDialogComponent;
  let fixture: ComponentFixture<UserChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserChangePasswordDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
