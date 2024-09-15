import { Component, input, OnInit, signal } from '@angular/core';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.scss'
})
export class HomeUserComponent implements OnInit{
  user = input.required<User | null>();
  currentDate = new Date();
  isMeetingToday = signal(false);

  ngOnInit(): void {
    
  }
}
