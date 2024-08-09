import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  Client,
  ClientRegistration,
  ClientResponse,
  GetClientResponse,
} from '../models/client.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  constructor() {}

  getClients(
    pageIndex: number,
    itemsPerPage: number,
    sortDirection: string,
    sortColumnName: string,
    value = '',
  ): Observable<GetClientResponse> {
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);

    if (sortColumnName) {
      params = params
        .append('_page', pageIndex)
        .append('_limit', itemsPerPage)
        .append('_sort', sortColumnName)
        .append('_order', sortDirection);
    }

    if (value) {
      params = params.append('firstname_like', value);
    }

    return this.httpClient
      .get<ClientResponse[]>(`${this.apiUrl}/clients`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          if (!response.body) {
            return { clients: [], totalCount: 0 };
          }
          const clients: Client[] = response.body.map(
            ({ id, firstname, lastname, email, phone, address, postcode }) =>
              new Client(
                id,
                firstname,
                lastname,
                email,
                phone,
                address,
                postcode,
              ),
          );

          const totalCount = Number(response.headers.get('X-Total-Count'));

          return { clients, totalCount };
        }),
      );
  }

  getClient(id: string): Observable<Client> {
    return this.httpClient
      .get<ClientResponse>(`${this.apiUrl}/clients/${id}`)
      .pipe(
        map(
          ({ id, firstname, lastname, email, phone, address, postcode }) =>
            new Client(id, firstname, lastname, email, phone, address, postcode),
        ),
      );
  }

  postClient(clientData: ClientRegistration): Observable<Client> {
    return this.httpClient
      .post<ClientResponse>(`${this.apiUrl}/clients`, clientData)
      .pipe(
        map(
          ({ id, firstname, lastname, email, phone, address, postcode }) =>
            new Client(id, firstname, lastname, email, phone, address, postcode),
        ),
      );
  }

  deleteClient(clientId: string): Observable<{}> {
    return this.httpClient.delete(`${this.apiUrl}/clients/${clientId}`);
  }
}
