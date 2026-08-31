import { Component } from '@angular/core';
import { UserPageComponent } from './user-page/user-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'lifecycle-test';
}