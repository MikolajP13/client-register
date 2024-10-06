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
import { MatDialog } from '@angular/material/dialog';
import { EditClientDialogComponent } from '../client/edit-client-dialog/edit-client-dialog.component';
import { DeleteClientDialogComponent } from '../client/delete-client-dialog/delete-client-dialog.component';

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss',
})
export class ClientsTableComponent implements AfterViewInit {
  private clientsService = inject(ClientsService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  
  private userId!: string;
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

    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );
    this.userId = userData.id;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page, this.clientsService.refreshClient$)
        .pipe(
          startWith({}),
          switchMap(() => {
            const pageIndex = this.paginator.pageIndex + 1;
            const itemsPerPage = this.paginator.pageSize;
            const sortDirection = this.sort.direction;
            const sortColumnName = this.sort.active;

            return this.clientsService.getClients(
              this.userId,
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
      .getClients(this.userId, pageIndex, itemsPerPage, sortDirection, sortColumnName, value)
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

  onEditClient(clientId: string) {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      data: clientId,
      width: '700px',
      maxWidth: '700px',
    });
  }

  onDeleteClient(clientId: string) {
    const dialogRef = this.dialog.open(DeleteClientDialogComponent, {
      data: clientId,
    });
    dialogRef.updateSize('400px', '200px');
  }
}
