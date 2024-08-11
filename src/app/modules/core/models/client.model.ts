import { FormControl } from '@angular/forms';

export interface ClientResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
}

export type ClientRegistrationAndEdit = Omit<Client, 'id'>;

export class Client implements ClientResponse {
  constructor(
    public id: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public phone: string,
    public address: string,
    public postcode: string,
  ) {}
}

export interface GetClientResponse {
  clients: Client[];
  totalCount: number;
}

export interface ClientForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  postcode: FormControl<string>;
}
