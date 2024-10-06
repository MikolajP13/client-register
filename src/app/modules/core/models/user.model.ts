import { FormControl } from "@angular/forms";

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  password: string;
  email: string;
  country: string;
  city: string;
  phoneNumber: string;
}

export interface UserForm {
  username: FormControl<string>;
  email: FormControl<string>;
  country: FormControl<string>;
  city: FormControl<string>;
  phoneNumber: FormControl<string>;
}

export type UserDetailsData = Omit<UserResponse, 'password'>;
export type UserRegistrationData = Omit<
  UserResponse,
  'id' | 'email' | 'country' | 'city' | 'phoneNumber'
>;

export class UserDetails {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public country: string,
    public city: string,
    public phoneNumber: string,
  ) {}
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public username: string,
  ) {}
}
