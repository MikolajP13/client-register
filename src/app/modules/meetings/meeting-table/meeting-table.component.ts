import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MeetingService } from '../../core/services/meeting.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MeetingCarousel } from '../../core/models/meeting.model';
import { Subscription, map, merge, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-meeting-table',
  templateUrl: './meeting-table.component.html',
  styleUrl: './meeting-table.component.scss',
})
export class MeetingTableComponent implements AfterViewInit {
  private meetingService = inject(MeetingService);
  private destroyRef = inject(DestroyRef);
  userId!: string;

  totalCount = signal<number>(0);
  displayedColumns: string[] = ['no', 'client', 'date', 'status'];
  dataSource!: MatTableDataSource<MeetingCarousel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription = new Subscription();

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    const userData: { id: string } = JSON.parse(
      localStorage.getItem('user') as string,
    );
    this.userId = userData.id;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            const pageIndex = this.paginator.pageIndex + 1;
            const itemsPerPage = this.paginator.pageSize;
            
            return this.meetingService.getMeetings(
              this.userId,
              pageIndex,
              itemsPerPage,
            );
          }),
          map((data) => {
            this.totalCount.set(data.totalCount);
            return data.meetings;
          })
        )
        .subscribe((meetings) => {
          this.dataSource = new MatTableDataSource<MeetingCarousel>(meetings);
        }),
    );

    this.destroyRef.onDestroy(() => {
      this.subscription.unsubscribe();
    });
  }
}
