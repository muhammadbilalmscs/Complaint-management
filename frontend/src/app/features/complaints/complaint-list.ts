import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plus } from '@primeicons/angular/plus';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from './complaint.model';
import { ComplaintService } from './complaint.service';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

@Component({
  selector: 'app-complaint-list',
  imports: [
    FormsModule,
    DatePipe,
    TableModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    MessageModule,
    Plus,
  ],
  templateUrl: './complaint-list.html',
  styleUrl: './complaint-list.css',
})
export class ComplaintList {
  private readonly complaintService = inject(ComplaintService);

  readonly complaints: Complaint[] = this.complaintService.getComplaints();
  readonly searchFields = ['title', 'description'];

  readonly statusOptions: { label: string; value: ComplaintStatus }[] = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];

  readonly categoryOptions: { label: string; value: ComplaintCategory }[] = [
    { label: 'Transport', value: 'Transport' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Environment', value: 'Environment' },
    { label: 'Public Services', value: 'Public Services' },
    { label: 'Infrastructure', value: 'Infrastructure' },
    { label: 'Other', value: 'Other' },
  ];

  statusFilter: ComplaintStatus | null = null;
  categoryFilter: ComplaintCategory | null = null;
  showCreateHint = false;

  onSearch(event: Event, table: Table): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  filterField(table: Table, field: 'status' | 'category', value: string | null): void {
    table.filter(value, field, 'equals');
  }

  onNewComplaint(): void {
    this.showCreateHint = true;
  }

  prioritySeverity(priority: ComplaintPriority): TagSeverity {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warn';
      case 'Low':
        return 'secondary';
    }
  }

  statusSeverity(status: ComplaintStatus): TagSeverity {
    switch (status) {
      case 'Open':
        return 'info';
      case 'In Progress':
        return 'warn';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'secondary';
    }
  }
}
