import { Component, signal, computed, effect } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCartComponent {
  availableProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 25000 },
    { id: 2, name: 'Smart Watch', price: 5500 },
    { id: 3, name: 'Mechanical Keyboard', price: 2000 },
    { id: 4, name: 'Wireless Mouse', price: 1200 }
  ];

  cart = signal<Product[]>([]);

  totalPrice = computed(() =>
    this.cart().reduce((sum, product) => sum + product.price, 0)
  );

  constructor() {
    effect(() => {
      console.log(`Cart items count: ${this.cart().length}`);
    });
  }

  addToCart(product: Product) {
    this.cart.update(items => [...items, product]);
  }

  removeFromCart(productId: number) {
    this.cart.update(items => {
      const index = items.findIndex(p => p.id === productId);
      if (index !== -1) {
        const newCart = [...items];
        newCart.splice(index, 1);
        return newCart;
      }
      return items;
    });
  }

  clearCart() {
    this.cart.set([]);
  }
}