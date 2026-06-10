import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sbb } from './sbb';

const CONNECTIONS_URL = 'https://transport.opendata.ch/v1/connections';

describe('Sbb', () => {
  let fixture: ComponentFixture<Sbb>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Sbb],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Sbb);
  });

  afterEach(() => {
    vi.useRealTimers();
    httpMock.verify();
  });

  function type(placeholder: string, value: string): void {
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      `input[placeholder="${placeholder}"]`,
    );
    if (!input) {
      throw new Error(`No input with placeholder ${placeholder}`);
    }
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('renders the two search inputs and no result initially', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('input[placeholder="Von"]')).not.toBeNull();
    expect(element.querySelector('input[placeholder="Nach"]')).not.toBeNull();
    expect(element.querySelector('h2')).toBeNull();
    expect(element.querySelector('app-progress-spinner')).toBeNull();

    TestBed.tick();
    httpMock.expectNone((req) => req.url === CONNECTIONS_URL);
  });

  it('searches connections after the debounce time and shows the result', async () => {
    fixture.detectChanges();
    type('Von', 'Bern');
    type('Nach', 'Thun');
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent).toContain(
      'Bern - Thun',
    );

    TestBed.tick();
    httpMock.expectNone((req) => req.url === CONNECTIONS_URL);

    vi.advanceTimersByTime(500);
    TestBed.tick();

    const request = httpMock.expectOne((req) => req.url === CONNECTIONS_URL);
    expect(request.request.params.get('from')).toBe('Bern');
    expect(request.request.params.get('to')).toBe('Thun');

    request.flush({
      connections: [
        {
          from: {
            station: { name: 'Bern' },
            departureTimestamp: 1781088960,
            arrivalTimestamp: null,
            delay: null,
            platform: '7',
          },
          to: {
            station: { name: 'Thun' },
            departureTimestamp: null,
            arrivalTimestamp: 1781090280,
            delay: null,
            platform: '4',
          },
        },
      ],
    });
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Bern - Thun');
    expect(text).toContain('Abfahrt');
  });

  it('does not search while one of the inputs is empty', () => {
    fixture.detectChanges();
    type('Von', 'Bern');
    fixture.detectChanges();

    vi.advanceTimersByTime(500);
    TestBed.tick();

    httpMock.expectNone((req) => req.url === CONNECTIONS_URL);
    expect((fixture.nativeElement as HTMLElement).querySelector('h2')).toBeNull();
  });
});
