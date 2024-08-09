import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './modules/core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'client-register';
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
