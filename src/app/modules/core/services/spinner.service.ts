import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  showSpinner() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }
}
