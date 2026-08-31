import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  leaving: boolean;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, type: ToastType = 'info', duration = 3800): void {
    const id = nextId++;
    this.toasts.update((list) => [...list, { id, text, type, leaving: false }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(text: string, duration?: number): void { this.show(text, 'success', duration); }
  error(text: string, duration?: number): void { this.show(text, 'error', duration); }
  info(text: string, duration?: number): void { this.show(text, 'info', duration); }

  dismiss(id: number): void {
    this.toasts.update((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, 200);
  }
}
