import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...appConfig.providers],
    }).compileComponents();
  });

  it('creates the application shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('CivicConnect');
    expect(compiled.querySelector('[data-testid="primeng-ready-button"]')).toBeTruthy();
    expect(compiled.querySelector('[data-testid="primeng-ready-message"]')).toBeNull();
  });

  it('shows a success message after the PrimeNG button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      '[data-testid="primeng-ready-button"]',
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    const message = fixture.nativeElement.querySelector('[data-testid="primeng-ready-message"]');
    expect(message?.textContent).toContain('PrimeNG is wired up');
  });
});
