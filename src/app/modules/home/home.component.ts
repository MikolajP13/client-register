import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  user = signal<User | null>(null);

  ngOnInit(): void {
    const subscription = this.authService.user$.subscribe((user) => {
      this.user.set(user);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}
