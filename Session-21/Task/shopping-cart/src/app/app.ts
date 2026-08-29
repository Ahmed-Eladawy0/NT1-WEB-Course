import { Component } from '@angular/core';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShoppingCartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'shopping-cart';
}