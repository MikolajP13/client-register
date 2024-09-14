import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import {
  User,
  UserDetailsData,
  UserLoginData,
  UserRegistrationData,
  UserResponse,
} from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);
  userDetails$ = new BehaviorSubject<UserDetailsData | null>(null);
  apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {}

  login(userData: UserLoginData) {
    return this.httpClient.get<UserResponse[]>(`${this.apiUrl}/users`).pipe(
      map((userArray) =>
        userArray.filter(
          (u) =>
            u.username === userData.username &&
            u.password === userData.password,
        ),
      ),
      map((userData) => {
        if (userData.length === 1)
          return new User(userData[0].email, userData[0].username);
        else return null;
      }),
      tap((user) => this.handleAuthentication(user)),
    );
  }

  isLoggedIn(): boolean {
    return !!this.user$.getValue();
  }

  logout() {
    this.user$.next(null);
    this.router.navigate(['login']);
    localStorage.removeItem('user');
  }

  autoLogin() {
    const userData: { email: string; username: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );

    if (!userData) {
      return;
    }

    const user = new User(userData.email, userData.username);
    this.user$.next(user);
  }

  register(userData: UserRegistrationData) {
    return this.httpClient
      .post<UserResponse>(`${this.apiUrl}/users`, userData)
      .pipe(tap(() => this.router.navigate(['login'])));
  }

  private handleAuthentication(user: User | null) {
    if (user) {
      this.user$.next(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['clients']);
    } else {
      return;
    }
  }
}
