import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { Complaint } from './complaint.model';
import { ComplaintForm } from './complaint-form';
import { ComplaintList } from './complaint-list';

const complaintsUrl = `${environment.apiUrl}/complaints`;

const sampleComplaints: Complaint[] = [
  {
    id: 1,
    title: 'Road surface damage on High Street',
    description: 'A pothole near the bus stop is damaging vehicles.',
    category: 'Transport',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-09-20T12:00:00Z',
    createdBy: 'Amina Shah',
  },
  {
    id: 6,
    title: 'Bridge inspection request',
    description: 'The footbridge railing is loose at the north end.',
    category: 'Infrastructure',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-09-22T12:00:00Z',
    createdBy: 'Jonas Berg',
  },
];

describe('ComplaintList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintList],
      providers: [MessageService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should render the complaint list from the API', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
    flushComplaints(sampleComplaints);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Complaints');
    expect(compiled.textContent).toContain('Road surface damage on High Street');
    expect(compiled.textContent).toContain('Bridge inspection request');
    expect(compiled.querySelector('[data-testid="complaint-search"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="new-complaint"]')).toBeTruthy();
  });

  it('should show required field messages and keep the list unchanged', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
    flushComplaints(sampleComplaints);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      '[data-testid="new-complaint"]',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    const save = document.querySelector('[data-testid="save-complaint"]') as HTMLButtonElement;
    save.click();
    await fixture.whenStable();

    expect(document.body.textContent).toContain('Subject is required.');
    expect(document.body.textContent).toContain('Description is required.');
    expect(document.body.textContent).toContain('Category is required.');
    expect(document.body.textContent).toContain('Priority is required.');
    expect(fixture.componentInstance.complaints().length).toBe(sampleComplaints.length);
    TestBed.inject(HttpTestingController).expectNone(complaintsUrl);
  });

  it('should add a complaint from the dialog', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
    flushComplaints(sampleComplaints);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      '[data-testid="new-complaint"]',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    const form = fixture.debugElement.query(By.directive(ComplaintForm))
      .componentInstance as ComplaintForm;
    form.form.setValue({
      title: 'Broken bench in the square',
      description: 'The bench near the fountain is split.',
      category: 'Environment',
      priority: 'Low',
      createdAt: new Date(2026, 8, 26),
    });

    const save = document.querySelector('[data-testid="save-complaint"]') as HTMLButtonElement;
    save.click();

    const created: Complaint = {
      id: 9,
      title: 'Broken bench in the square',
      description: 'The bench near the fountain is split.',
      category: 'Environment',
      priority: 'Low',
      status: 'Open',
      createdAt: '2026-09-27T18:00:00Z',
      createdBy: 'Demo User',
    };
    const http = TestBed.inject(HttpTestingController);
    const post = http.expectOne(complaintsUrl);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual({
      title: 'Broken bench in the square',
      description: 'The bench near the fountain is split.',
      category: 'Environment',
      priority: 'Low',
    });
    post.flush(created);
    flushComplaints([created, ...sampleComplaints]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Broken bench in the square');
    expect(fixture.componentInstance.complaints()[0]?.createdBy).toBe('Demo User');
    expect(fixture.componentInstance.complaints()[0]?.status).toBe('Open');
  });
});

function flushComplaints(complaints: Complaint[]): void {
  const http = TestBed.inject(HttpTestingController);
  const request = http.expectOne(complaintsUrl);
  expect(request.request.method).toBe('GET');
  request.flush(complaints);
}
