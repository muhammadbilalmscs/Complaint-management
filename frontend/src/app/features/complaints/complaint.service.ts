import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from './complaint.model';

export interface NewComplaint {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  createdAt: Date;
}

export interface UpdateComplaint {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly http = inject(HttpClient);
  private readonly collectionUrl = `${environment.apiUrl}/complaints`;

  readonly complaints = signal<Complaint[]>([]);
  readonly loadError = signal(false);

  load(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.collectionUrl).pipe(
      tap((items) => {
        this.loadError.set(false);
        this.complaints.set(items);
      }),
      catchError((error: unknown) => {
        this.loadError.set(true);
        return throwError(() => error);
      }),
    );
  }

  getById(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.collectionUrl}/${id}`);
  }

  create(draft: NewComplaint): Observable<Complaint> {
    const body = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
      priority: draft.priority,
    };

    return this.http.post<Complaint>(this.collectionUrl, body).pipe(
      tap((created) => {
        this.complaints.update((current) => [
          created,
          ...current.filter((item) => item.id !== created.id),
        ]);
      }),
      switchMap((created) =>
        this.load().pipe(
          map(() => created),
          catchError(() => of(created)),
        ),
      ),
    );
  }

  update(id: number, changes: UpdateComplaint): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.collectionUrl}/${id}`, changes).pipe(
      switchMap((updated) =>
        this.load().pipe(
          map(() => updated),
          catchError(() => of(updated)),
        ),
      ),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.collectionUrl}/${id}`).pipe(
      switchMap(() =>
        this.load().pipe(
          map(() => undefined),
          catchError(() => of(undefined)),
        ),
      ),
    );
  }
}
