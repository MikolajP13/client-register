import { FormControl } from '@angular/forms';

export interface ClientResponse {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  street: string;
  postcode: string;
  company: string;
  sector: string;
  status: ClientStatus;
}

export type ClientRegistrationAndEdit = Omit<Client, 'id'>;

export class Client implements ClientResponse {
  constructor(
    public id: string,
    public userId: string,
    public firstname: string,
    public lastname: string,
    public phone: string,
    public email: string,
    public country: string,
    public city: string,
    public street: string,
    public postcode: string,
    public company: string,
    public sector: string,
    public status: ClientStatus,
  ) {}
}

export interface GetClientResponse {
  clients: Client[];
  totalCount: number;
}

export interface ClientForm {
  firstname: FormControl<string>;
  lastname: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  country: FormControl<string>;
  city: FormControl<string>;
  street: FormControl<string>;
  postcode: FormControl<string>;
  company: FormControl<string>;
  sector: FormControl<string>;
  status: FormControl<ClientStatus>;
}

export enum ClientStatus {
  New = 'New',
  Contacted = 'Contacted',
  Interesed = 'Interesed',
  NotInteresed = 'Not interesed',
  DealClosed = 'Deal closed',
}
