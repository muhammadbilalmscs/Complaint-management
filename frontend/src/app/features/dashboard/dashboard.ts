import { Component, inject } from '@angular/core';
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
  private readonly complaints = inject(ComplaintService).getComplaints();

  readonly totalCount = this.complaints.length;
  readonly openCount = this.complaints.filter((complaint) => complaint.status === 'Open').length;
}
