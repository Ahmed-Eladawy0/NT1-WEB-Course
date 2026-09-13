import {
  Component, Input, Output, EventEmitter,
  HostListener, signal, computed
} from '@angular/core';
import { Course } from '../../../core/models/models';

type PayMethod = 'card' | 'instapay' | 'vodafone' | 'etisalat' | 'apple';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.css'
})
export class PaymentModalComponent {

  /* ---- Input ---- */
  private _courseSignal = signal<Course | null>(null);

  @Input() set course(v: Course | null) {
    this._courseSignal.set(v);
    if (v) this.reset();
  }
  get course(): Course | null { return this._courseSignal(); }

  /* ---- Outputs ---- */
  @Output() confirmed = new EventEmitter<{ course: Course, method: string }>();
  @Output() cancelled = new EventEmitter<void>();

  /* ---- Template helper ---- */
  courseData = computed(() => this._courseSignal());

  /* ---- Payment state ---- */
  selectedMethod  = signal<PayMethod>('card');
  cardNumber      = signal('');
  cardName        = signal('');
  cardExpiry      = signal('');
  cardCvv         = signal('');
  phone           = signal('');
  processing      = signal(false);

  /* Auto-detect card network from first digits */
  cardNetworkLogo = computed(() => {
    const n = this.cardNumber().replace(/\s/g, '');
    if (n.startsWith('34') || n.startsWith('37')) return 'amex';
    if (n.startsWith('4'))                        return 'visa';
    if (/^5[1-5]/.test(n))                       return 'mastercard';
    if (n.startsWith('6'))                        return 'meeza';
    return 'unknown';
  });

  /* Card number display (with spaces) or masked placeholder */
  maskedNumber = computed(() => this.cardNumber() || '•••• •••• •••• ••••');

  /* ---- Input handlers ---- */
  onCardNumberInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    let val  = el.value.replace(/\D/g, '').slice(0, 16);
    val      = val.replace(/(.{4})/g, '$1 ').trim();
    this.cardNumber.set(val);
    el.value = val;
  }

  onExpiryInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    let val  = el.value.replace(/\D/g, '').slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
    this.cardExpiry.set(val);
    el.value = val;
  }

  onCvvInput(e: Event): void {
    const el = e.target as HTMLInputElement;
    const val = el.value.replace(/\D/g, '').slice(0, 4);
    this.cardCvv.set(val);
    el.value = val;
  }

  selectMethod(m: PayMethod): void {
    this.selectedMethod.set(m);
    this.phone.set(''); // clear wallet phone when switching
  }

  /* ---- Validation ---- */
  isValid = computed(() => {
    const m = this.selectedMethod();
    switch (m) {
      case 'card': {
        const n = this.cardNumber().replace(/\s/g, '');
        return (
          n.length >= 15 &&
          this.cardName().trim().length >= 2 &&
          this.cardExpiry().length === 5 &&
          this.cardCvv().length >= 3
        );
      }
      case 'instapay': return true;   // user scans QR — just confirm
      case 'vodafone':
      case 'etisalat':
        return /^01[0-9]{9}$/.test(this.phone().replace(/\s/g, ''));
      case 'apple': return true;      // Face/Touch ID simulated
      default: return false;
    }
  });

  /* ---- Confirm ---- */
  onConfirm(): void {
    const c = this._courseSignal();
    if (!c || !this.isValid() || this.processing()) return;
    this.processing.set(true);
    // Simulate payment processing delay, then emit
    setTimeout(() => {
      this.processing.set(false);
      this.confirmed.emit({ course: c, method: this.selectedMethod() });
    }, 1800);
  }

  /* ---- Dismiss ---- */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this._courseSignal() && !this.processing()) this.cancelled.emit();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('payment-overlay') && !this.processing()) {
      this.cancelled.emit();
    }
  }

  /* ---- Reset ---- */
  private reset(): void {
    this.selectedMethod.set('card');
    this.cardNumber.set('');
    this.cardName.set('');
    this.cardExpiry.set('');
    this.cardCvv.set('');
    this.phone.set('');
    this.processing.set(false);
  }
}
