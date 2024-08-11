import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit {
  isLoading = signal(false);
  private spinnerService = inject(SpinnerService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscribe = this.spinnerService.isLoading.subscribe((state) => {
      this.isLoading.set(state);
    });

    this.destroyRef.onDestroy(() => {
      subscribe.unsubscribe();
    })
  }
  
}
