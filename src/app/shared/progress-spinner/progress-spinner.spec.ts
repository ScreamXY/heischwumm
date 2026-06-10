import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressSpinner } from './progress-spinner';

describe('ProgressSpinner', () => {
  let fixture: ComponentFixture<ProgressSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressSpinner],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressSpinner);
  });

  it('renders with the default diameter of 80px', async () => {
    await fixture.whenStable();
    const spinner = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.spinner');

    expect(spinner?.style.width).toBe('80px');
    expect(spinner?.style.height).toBe('80px');
    expect(spinner?.style.borderWidth).toBe('8px');
  });

  it('scales the border with the given diameter', async () => {
    fixture.componentRef.setInput('diameter', 150);
    await fixture.whenStable();
    const spinner = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.spinner');

    expect(spinner?.style.width).toBe('150px');
    expect(spinner?.style.borderWidth).toBe('15px');
  });
});
