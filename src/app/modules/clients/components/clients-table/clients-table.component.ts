import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ClientsService } from '../../../core/services/clients.service';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../../../core/models/client.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss',
})
export class ClientsTableComponent implements AfterViewInit {
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  totalCount = signal<number>(0);
  filterValue = new FormControl('', { nonNullable: true });

  displayedColumns: string[] = [
    'no',
    'firstname',
    'lastname',
    'email',
    'buttons',
  ];

  clientDataSource!: MatTableDataSource<Client>;
  subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            const pageIndex = this.paginator.pageIndex + 1;
            const itemsPerPage = this.paginator.pageSize;
            const sortDirection = this.sort.direction;
            const sortColumnName = this.sort.active;

            return this.clientsService.getClients(
              pageIndex,
              itemsPerPage,
              sortDirection,
              sortColumnName,
            );
          }),
          map((data) => {
            this.totalCount.set(data.totalCount);
            return data.clients;
          }),
        )
        .subscribe((clients) => {
          this.clientDataSource = new MatTableDataSource<Client>(clients);
        }),
    );

    this.subscription.add(
      this.filterValue.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((value) => {
          const val = value?.trim().toLowerCase();
          this.applyFilter(val);
        }),
    );

    this.destroyRef.onDestroy(() => {
      this.subscription.unsubscribe();
    });
  }

  applyFilter(value: string) {
    const pageIndex = this.paginator.pageIndex + 1;
    const itemsPerPage = this.paginator.pageSize;
    const sortDirection = this.sort.direction;
    const sortColumnName = this.sort.active;

    this.clientsService
      .getClients(pageIndex, itemsPerPage, sortDirection, sortColumnName, value)
      .subscribe({
        next: (response) => {
          this.totalCount.set(response.totalCount);
          this.clientDataSource = new MatTableDataSource<Client>(
            response.clients,
          );
        },
      });

    if (this.clientDataSource.paginator) {
      this.clientDataSource.paginator.firstPage();
    }
  }

  onAddClient() {
    this.router.navigate(['clients/new']);
  }
}
