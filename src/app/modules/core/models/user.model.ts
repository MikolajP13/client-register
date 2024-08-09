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
}

export type UserRegistrationData = Omit<UserResponse, 'id'>;

export class User {
  constructor(public email: string, public username: string) {}
}