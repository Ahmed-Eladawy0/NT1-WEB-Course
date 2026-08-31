import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
}

export interface ConfirmState extends ConfirmOptions {
  open: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly state = signal<ConfirmState>({ open: false });
  private resolver: ((result: boolean) => void) | null = null;

  ask(options: ConfirmOptions = {}): Promise<boolean> {
    this.state.set({
      open: true,
      title: options.title ?? 'Are you sure?',
      message: options.message ?? '',
      confirmLabel: options.confirmLabel ?? 'Confirm',
      danger: options.danger ?? true,
    });
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  resolve(result: boolean): void {
    this.state.update((s) => ({ ...s, open: false }));
    if (this.resolver) {
      this.resolver(result);
      this.resolver = null;
    }
  }
}
