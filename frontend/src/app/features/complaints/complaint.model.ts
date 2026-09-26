export type ComplaintCategory =
  | 'Transport'
  | 'Utilities'
  | 'Environment'
  | 'Public Services'
  | 'Infrastructure'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  createdBy: string;
}
