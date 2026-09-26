import { Routes } from '@angular/router';
import { ComplaintList } from './features/complaints/complaint-list';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'complaints' },
  { path: 'dashboard', component: Dashboard },
  { path: 'complaints', component: ComplaintList },
];
