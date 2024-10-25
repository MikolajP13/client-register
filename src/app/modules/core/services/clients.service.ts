import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  Client,
  ClientRegistrationAndEdit,
  ClientResponse,
  GetClientResponse,
} from '../models/client.model';
import { filter, map, Observable, pipe, Subject, tap } from 'rxjs';
import { PaginatedResponse } from '../models/server-response.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  refreshClient$ = new Subject<void>();

  constructor() {}

  getClientsByUserId(userId: string) {
    return this.httpClient
      .get<ClientResponse[]>(`${this.apiUrl}/clients`)
      .pipe(
        map((response) =>
          response.filter((client) => client.userId === userId),
        ),
      );
  }

  getClients(
    userId: string,
    pageIndex: number,
    itemsPerPage: number,
    sortDirection: string,
    sortColumnName: string,
    value = '',
  ): Observable<GetClientResponse> {
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_per_page', itemsPerPage);

    if (sortColumnName) {
      params = params
        .set('_sort', sortDirection === 'desc' ? '-' + sortColumnName : sortColumnName);
    }

    // Note: Filtering using regexp does not work in JSON Server version 1.0.0
    if (value) {
      params = params.set('firstname_like', value);
    }

    return this.httpClient
      .get<PaginatedResponse<ClientResponse>>(`${this.apiUrl}/clients`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          console.log(response.body)
          if (!response.body?.data) {
            return { clients: [], totalCount: 0 };
          }
          const clients: Client[] = response.body.data
            .filter((client) => client.userId === userId)
            .map(
              ({
                id,
                userId,
                firstname,
                lastname,
                phone,
                email,
                country,
                city,
                street,
                postcode,
                company,
                sector,
                status,
              }) =>
                new Client(
                  id,
                  userId,
                  firstname,
                  lastname,
                  phone,
                  email,
                  country,
                  city,
                  street,
                  postcode,
                  company,
                  sector,
                  status,
                ),
            );

          const totalCount = response.body.items;
          return { clients, totalCount };
        }),
      );
  }

  getClient(id: string): Observable<Client> {
    return this.httpClient
      .get<ClientResponse>(`${this.apiUrl}/clients/${id}`)
      .pipe(
        map(
          ({
            id,
            userId,
            firstname,
            lastname,
            phone,
            email,
            country,
            city,
            street,
            postcode,
            company,
            sector,
            status,
          }) =>
            new Client(
              id,
              userId,
              firstname,
              lastname,
              phone,
              email,
              country,
              city,
              street,
              postcode,
              company,
              sector,
              status,
            ),
        ),
      );
  }

  postClient(clientData: ClientRegistrationAndEdit): Observable<Client> {
    return this.httpClient
      .post<ClientResponse>(`${this.apiUrl}/clients`, clientData)
      .pipe(
        map(
          ({
            id,
            userId,
            firstname,
            lastname,
            phone,
            email,
            country,
            city,
            street,
            postcode,
            company,
            sector,
            status,
          }) =>
            new Client(
              id,
              userId,
              firstname,
              lastname,
              phone,
              email,
              country,
              city,
              street,
              postcode,
              company,
              sector,
              status,
            ),
        ),
      );
  }

  putClient(
    clientData: ClientRegistrationAndEdit,
    id: string,
  ): Observable<Client> {
    return this.httpClient
      .put<ClientResponse>(`${this.apiUrl}/clients/${id}`, clientData)
      .pipe(
        map(
          ({
            id,
            userId,
            firstname,
            lastname,
            phone,
            email,
            country,
            city,
            street,
            postcode,
            company,
            sector,
            status,
          }) =>
            new Client(
              id,
              userId,
              firstname,
              lastname,
              phone,
              email,
              country,
              city,
              street,
              postcode,
              company,
              sector,
              status,
            ),
        ),
      );
  }

  deleteClient(clientId: string): Observable<{}> {
    return this.httpClient
      .delete(`${this.apiUrl}/clients/${clientId}`)
      .pipe(tap(() => this.refreshClient$.next()));
  }
}
