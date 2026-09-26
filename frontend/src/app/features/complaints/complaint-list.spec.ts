import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ComplaintForm } from './complaint-form';
import { ComplaintList } from './complaint-list';

describe('ComplaintList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintList],
      providers: [MessageService],
    }).compileComponents();
  });

  it('should render the complaint list from mock data', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
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
    expect(fixture.componentInstance.complaints().length).toBe(8);
  });

  it('should add a complaint from the dialog', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
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
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Broken bench in the square');
    expect(fixture.componentInstance.complaints()[0]?.createdBy).toBe('Demo User');
    expect(fixture.componentInstance.complaints()[0]?.status).toBe('Open');
  });
});
