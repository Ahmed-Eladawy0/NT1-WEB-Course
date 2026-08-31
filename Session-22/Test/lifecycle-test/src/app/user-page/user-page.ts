import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserCardComponent } from '../user-card/user-card'; // 👈 استدعاء الابن

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPageComponent {
  users: User[] = [
    { id: 1, name: 'Adawy', role: 'Admin' },
    { id: 2, name: 'Jana', role: 'User' },
    { id: 3, name: 'Soli', role: 'Admin' },
    { id: 4, name: 'Sara', role: 'User' },
    { id: 5, name: 'Dana', role: 'User' },
  ];

  removeUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }
}