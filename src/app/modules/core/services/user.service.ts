import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, mergeMap, Observable, of, throwError } from 'rxjs';
import {
  UserResponse,
  UserDetailsData,
  UserDetails,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  apiUrl = environment.apiUrl;

  constructor() {}

  getUserDetails(userEmail: string) {
    return this.httpClient.get<UserResponse[]>(`${this.apiUrl}/users`).pipe(
      map((userArray) => userArray.filter((user) => user.email === userEmail)),
      map((userData) => {
        if (userData.length === 1) return userData[0];
        else return null;
      }),
      map((userResponse) =>
        this.convertUserResponseToUserDetails(userResponse),
      ),
    );
  }

  patchUser(
    userDetails: UserDetailsData,
    id: string,
  ): Observable<UserDetailsData> {
    return this.httpClient
      .patch<UserDetailsData>(`${this.apiUrl}/users/${id}`, userDetails)
      .pipe(
        map(
          (user) =>
            new UserDetails(
              user.id,
              user.username,
              user.email,
              user.country,
              user.city,
              user.phoneNumber,
            ),
        ),
      );
  }

  changeUserPassword(
    currentPassword: string,
    newPassword: string,
    userId: string,
  ) {
    return this.httpClient
      .get<UserResponse>(`${this.apiUrl}/users/${userId}`)
      .pipe(
        mergeMap((userResponse) => {
          if (userResponse.password === currentPassword) {
            return this.httpClient.patch<UserResponse>(
              `${this.apiUrl}/users/${userId}`,
              {
                password: newPassword,
              },
            );
          } else return throwError(() => new Error('Wrong current password!'));
        }),
      );
  }

  private convertUserResponseToUserDetails(userResponse: UserResponse | null) {
    if (userResponse) {
      const userDetails: UserDetails = {
        id: userResponse.id,
        username: userResponse.username,
        email: userResponse.email,
        country: userResponse.country,
        city: userResponse.city,
        phoneNumber: userResponse.phoneNumber,
      };
      return userDetails;
    }
    return null;
  }
}
