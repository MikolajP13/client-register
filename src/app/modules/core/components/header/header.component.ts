import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  isUserLogIn = signal<boolean>(false);
  userName = signal('');

  ngOnInit() {
    const subscription = this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.userName.set(user.username);
          this.isUserLogIn.set(true);
        } else {
          this.isUserLogIn.set(false);
        }
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  logout() {
    this.authService.logout();
    this.isUserLogIn.set(false);
  }
}
