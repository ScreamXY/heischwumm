import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

const AARE_URL = 'https://aareguru.existenz.ch/v2018/current';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CONNECTIONS_URL = 'https://transport.opendata.ch/v1/connections';

function connectionsResponse(to: string) {
  return {
    connections: [
      {
        from: {
          station: { name: 'Gümligen' },
          departureTimestamp: 1781088960,
          arrivalTimestamp: null,
          delay: null,
          platform: '1',
        },
        to: {
          station: { name: to },
          departureTimestamp: null,
          arrivalTimestamp: 1781090280,
          delay: null,
          platform: '4',
        },
      },
    ],
  };
}

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Home);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Lets the resources process their flushed responses (they resolve via
  // microtasks) and renders the result.
  async function settle(): Promise<void> {
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
  }

  async function flushAllRequests(): Promise<void> {
    TestBed.tick();
    httpMock
      .expectOne((req) => req.url === AARE_URL)
      .flush({ aare: { timestamp: 1781088000, temperature: 16.1, flow: 146 } });
    httpMock
      .expectOne((req) => req.url === FORECAST_URL)
      .flush({
        current: {
          temperature_2m: 14.27,
          relative_humidity_2m: 78,
          pressure_msl: 1019,
          wind_speed_10m: 2.24,
          weather_code: 61,
          is_day: 1,
        },
        daily: {
          temperature_2m_max: [15.64],
          temperature_2m_min: [13.61],
          sunrise: [1781062538],
          sunset: [1781119430],
        },
      });
    httpMock
      .expectOne((req) => req.url === CONNECTIONS_URL && req.params.get('to') === 'Thun')
      .flush(connectionsResponse('Thun'));
    httpMock
      .expectOne((req) => req.url === CONNECTIONS_URL && req.params.get('to') === 'Muri bei Bern')
      .flush(connectionsResponse('Muri bei Bern'));
    await settle();
  }

  it('renders the title and the initial reload counter', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1.title')?.textContent).toContain('Heischwumm');
    expect(element.querySelector('button.refresh')?.textContent).toContain('5:00');
  });

  it('shows a spinner in every card while loading', () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();

    const spinners = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'app-progress-spinner',
    );
    expect(spinners).toHaveLength(4);
  });

  it('renders all cards once the data has arrived', async () => {
    fixture.detectChanges();
    await flushAllRequests();
    const element = fixture.nativeElement as HTMLElement;
    const text = element.textContent ?? '';

    expect(element.querySelectorAll('app-progress-spinner')).toHaveLength(0);
    expect(text).toContain('Thun');
    expect(text).toContain('Muri');
    expect(text).toContain('Gümligen - Thun');
    expect(text).toContain('Gümligen - Muri bei Bern');
    expect(text).toContain('Luft Bern');
    expect(text).toContain('Leichter Regen');
    expect(text).toContain('14.27°C');
    expect(text).toContain('15.64°C');
    expect(text).toContain('13.61°C');
    expect(text).toContain('1019 hPa');
    expect(text).toContain('78%');
    expect(text).toContain('2.24 km/h');
    expect(text).toContain('Wasser Aare');
    expect(text).toContain('16.1°C');
    expect(text).toContain('146 m3/s');
  });

  it('links to Aare.guru and the BAFU as required by the Aare.guru API terms', () => {
    fixture.detectChanges();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>(
        '.aare .attribution a',
      ),
    );

    expect(links.map((link) => link.href)).toEqual([
      'https://aare.guru/',
      'https://www.hydrodaten.admin.ch/',
    ]);
  });

  it('links to Open-Meteo as required by their CC BY 4.0 license', () => {
    fixture.detectChanges();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>(
        '.weather .attribution a',
      ),
    );

    expect(links.map((link) => link.href)).toEqual(['https://open-meteo.com/']);
  });

  it('counts down towards the next reload with padded seconds', () => {
    fixture.detectChanges();

    vi.advanceTimersByTime(61_000);
    fixture.detectChanges();

    const refresh = (fixture.nativeElement as HTMLElement).querySelector('button.refresh');
    expect(refresh?.textContent).toContain('3:59');
  });

  it('reloads all data and resets the counter when the refresh header is clicked', async () => {
    fixture.detectChanges();
    await flushAllRequests();

    vi.advanceTimersByTime(10_000);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('button.refresh')?.textContent).toContain('4:50');

    element.querySelector<HTMLElement>('button.refresh')?.click();
    fixture.detectChanges();
    expect(element.querySelector('button.refresh')?.textContent).toContain('5:00');

    await flushAllRequests();
    expect(element.textContent).toContain('Gümligen - Thun');
  });

  it('reloads automatically once the interval has elapsed', async () => {
    fixture.detectChanges();
    await flushAllRequests();

    vi.advanceTimersByTime(301_000);
    fixture.detectChanges();

    await flushAllRequests();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Gümligen - Thun');
  });
});
