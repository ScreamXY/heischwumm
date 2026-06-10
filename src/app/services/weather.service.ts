import { httpResource } from '@angular/common/http';
import { computed, Injectable, Signal } from '@angular/core';

// Open-Meteo forecast API (https://open-meteo.com/): free for non-commercial
// use, no API key required. For Switzerland the data comes from MeteoSwiss'
// ICON-CH weather models. The data is CC BY 4.0, so the weather card links
// back to open-meteo.com.
interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number | null;
    relative_humidity_2m?: number | null;
    pressure_msl?: number | null;
    wind_speed_10m?: number | null;
    weather_code?: number | null;
    is_day?: number | null;
  } | null;
  daily?: {
    temperature_2m_max?: (number | null)[] | null;
    temperature_2m_min?: (number | null)[] | null;
    /** Epoch seconds (requested with timeformat=unixtime). */
    sunrise?: (number | null)[] | null;
    /** Epoch seconds (requested with timeformat=unixtime). */
    sunset?: (number | null)[] | null;
  } | null;
}

export interface WeatherInfo {
  name: string;
  description: string;
  icon: string | null;
  /** Epoch milliseconds. */
  sunrise: number | null;
  /** Epoch milliseconds. */
  sunset: number | null;
  temperature: number | null;
  temperatureMax: number | null;
  temperatureMin: number | null;
  pressure: number | null;
  humidity: number | null;
  /** km/h. */
  windSpeed: number | null;
}

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const CITY_NAME = 'Bern';
const BERN = { latitude: 46.9481, longitude: 7.4474 };

// WMO weather interpretation codes as documented by Open-Meteo.
const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Klarer Himmel',
  1: 'Überwiegend klar',
  2: 'Teilweise bewölkt',
  3: 'Bedeckt',
  45: 'Nebel',
  48: 'Reifnebel',
  51: 'Leichter Nieselregen',
  53: 'Nieselregen',
  55: 'Starker Nieselregen',
  56: 'Gefrierender Nieselregen',
  57: 'Starker gefrierender Nieselregen',
  61: 'Leichter Regen',
  63: 'Regen',
  65: 'Starker Regen',
  66: 'Gefrierender Regen',
  67: 'Starker gefrierender Regen',
  71: 'Leichter Schneefall',
  73: 'Schneefall',
  75: 'Starker Schneefall',
  77: 'Schneegriesel',
  80: 'Leichte Regenschauer',
  81: 'Regenschauer',
  82: 'Starke Regenschauer',
  85: 'Leichte Schneeschauer',
  86: 'Schneeschauer',
  95: 'Gewitter',
  96: 'Gewitter mit leichtem Hagel',
  99: 'Gewitter mit Hagel',
};

// Maps WMO codes to the app's icon set (the original OpenWeatherMap names).
const WEATHER_ICONS: Record<number, string> = {
  0: '01',
  1: '02',
  2: '03',
  3: '04',
  45: '50',
  48: '50',
  51: '09',
  53: '09',
  55: '09',
  56: '09',
  57: '09',
  61: '10',
  63: '10',
  65: '10',
  66: '10',
  67: '10',
  71: '13',
  73: '13',
  75: '13',
  77: '13',
  80: '09',
  81: '09',
  82: '09',
  85: '13',
  86: '13',
  95: '11',
  96: '11',
  99: '11',
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly forecast = httpResource<OpenMeteoResponse>(() => ({
    url: FORECAST_URL,
    params: {
      latitude: BERN.latitude,
      longitude: BERN.longitude,
      current:
        'temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code,is_day',
      daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
      timezone: 'Europe/Zurich',
      timeformat: 'unixtime',
      forecast_days: 1,
    },
  }));

  public readonly weather: Signal<WeatherInfo | null> = computed(() =>
    this.forecast.hasValue() ? toWeatherInfo(this.forecast.value()) : null,
  );

  public readonly loading: Signal<boolean> = computed(() => this.forecast.isLoading());

  public reload(): void {
    this.forecast.reload();
  }
}

function toWeatherInfo(response: OpenMeteoResponse): WeatherInfo {
  const current = response.current;
  const daily = response.daily;
  const code = current?.weather_code;
  const icon = typeof code === 'number' ? (WEATHER_ICONS[code] ?? null) : null;
  const dayNightSuffix = current?.is_day === 0 ? 'n' : 'd';
  return {
    name: CITY_NAME,
    description: typeof code === 'number' ? (WEATHER_DESCRIPTIONS[code] ?? '') : '',
    icon: icon === null ? null : `${icon}${dayNightSuffix}`,
    sunrise: toMilliseconds(daily?.sunrise?.[0]),
    sunset: toMilliseconds(daily?.sunset?.[0]),
    temperature: current?.temperature_2m ?? null,
    temperatureMax: daily?.temperature_2m_max?.[0] ?? null,
    temperatureMin: daily?.temperature_2m_min?.[0] ?? null,
    pressure: current?.pressure_msl ?? null,
    humidity: current?.relative_humidity_2m ?? null,
    windSpeed: current?.wind_speed_10m ?? null,
  };
}

function toMilliseconds(epochSeconds: number | null | undefined): number | null {
  if (typeof epochSeconds !== 'number') {
    return null;
  }
  return epochSeconds * 1000;
}
