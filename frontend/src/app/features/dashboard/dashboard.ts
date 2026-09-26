import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ComplaintService } from '../complaints/complaint.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardModule, ButtonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly complaints = inject(ComplaintService).complaints;

  readonly totalCount = computed(() => this.complaints().length);
  readonly openCount = computed(
    () => this.complaints().filter((complaint) => complaint.status === 'Open').length,
  );
}
