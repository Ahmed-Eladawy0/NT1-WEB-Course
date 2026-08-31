import { Component, input, output } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.html',
  styleUrl: './user-card.css'
})
export class UserCardComponent {
  user = input.required<User>();

  deleteUser = output<number>();

  removeUser() {
    this.deleteUser.emit(this.user().id);
  }
}