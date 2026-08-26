import { Component } from '@angular/core';
import { TeamManagerComponent } from './components/team-manager/team-manager'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TeamManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'team-manager-app';
}