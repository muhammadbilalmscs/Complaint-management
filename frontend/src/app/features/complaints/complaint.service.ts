import { Injectable } from '@angular/core';
import { Complaint } from './complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly complaints: Complaint[] = [
    {
      id: 1,
      title: 'Road surface damage on High Street',
      description: 'A pothole near the bus stop is damaging vehicles.',
      category: 'Transport',
      priority: 'Medium',
      status: 'Open',
      createdAt: '2026-09-20T12:00:00',
      createdBy: 'Amina Shah',
    },
    {
      id: 2,
      title: 'Water leak on Oak Avenue',
      description: 'Water is pooling on the pavement outside number 14.',
      category: 'Utilities',
      priority: 'High',
      status: 'Open',
      createdAt: '2026-09-18T12:00:00',
      createdBy: 'Jonas Berg',
    },
    {
      id: 3,
      title: 'Night noise from the market',
      description: 'Loading vehicles arrive after midnight on weekdays.',
      category: 'Other',
      priority: 'Low',
      status: 'Closed',
      createdAt: '2026-08-28T12:00:00',
      createdBy: 'Elena Rossi',
    },
    {
      id: 4,
      title: 'Litter in Riverside Park',
      description: 'Bins near the playground are overflowing.',
      category: 'Environment',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2026-09-12T12:00:00',
      createdBy: 'Amina Shah',
    },
    {
      id: 5,
      title: 'Library opening hours',
      description: 'Saturday hours are too short for students.',
      category: 'Public Services',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '2026-09-08T12:00:00',
      createdBy: 'Noah Williams',
    },
    {
      id: 6,
      title: 'Bridge inspection request',
      description: 'The footbridge railing is loose at the north end.',
      category: 'Infrastructure',
      priority: 'High',
      status: 'Open',
      createdAt: '2026-09-22T12:00:00',
      createdBy: 'Jonas Berg',
    },
    {
      id: 7,
      title: 'Street lighting on Mill Lane',
      description: 'Three lamps have been out for a week.',
      category: 'Utilities',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2026-09-15T12:00:00',
      createdBy: 'Elena Rossi',
    },
    {
      id: 8,
      title: 'Bus stop shelter missing panel',
      description: 'The glass panel on the eastbound shelter is gone.',
      category: 'Transport',
      priority: 'Low',
      status: 'Resolved',
      createdAt: '2026-09-04T12:00:00',
      createdBy: 'Noah Williams',
    },
  ];

  getComplaints(): Complaint[] {
    return this.complaints.map((complaint) => ({ ...complaint }));
  }
}
