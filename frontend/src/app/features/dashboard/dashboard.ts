import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ComplaintService } from '../complaints/complaint.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ButtonModule, RouterLink, MessageModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly complaintService = inject(ComplaintService);
  private readonly messageService = inject(MessageService);
  private readonly complaints = this.complaintService.complaints;
  readonly loadError = this.complaintService.loadError;

  constructor() {
    this.complaintService.load().subscribe({
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Could not load complaints',
          detail: 'The API is unavailable. Start the backend and refresh this page.',
          life: 6000,
        });
      },
    });
  }

  readonly totalCount = computed(() => this.complaints().length);
  readonly openCount = computed(
    () => this.complaints().filter((complaint) => complaint.status === 'Open').length,
  );
}
