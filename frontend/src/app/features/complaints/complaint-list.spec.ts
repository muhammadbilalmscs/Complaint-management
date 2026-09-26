import { TestBed } from '@angular/core/testing';
import { ComplaintList } from './complaint-list';

describe('ComplaintList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintList],
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

  it('should explain that the create form is not available yet', async () => {
    const fixture = TestBed.createComponent(ComplaintList);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      '[data-testid="new-complaint"]',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain(
      'The new complaint form is added in the next phase.',
    );
  });
});
