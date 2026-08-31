import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  confirmService = inject(ConfirmService);

  cancel(): void {
    this.confirmService.resolve(false);
  }
  confirm(): void {
    this.confirmService.resolve(true);
  }
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.cancel();
  }
}
