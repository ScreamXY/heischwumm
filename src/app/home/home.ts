import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

import { Connection } from '../sbb/connection/connection';
import { AareService } from '../services/aare.service';
import { SbbService } from '../services/sbb.service';
import { WeatherService } from '../services/weather.service';
import { ProgressSpinner } from '../shared/progress-spinner/progress-spinner';

const RELOAD_INTERVAL_SECONDS = 300;
const TICK_INTERVAL_MS = 1000;

@Component({
  selector: 'app-home',
  imports: [DatePipe, Connection, ProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly aareService = inject(AareService);
  private readonly weatherService = inject(WeatherService);
  private readonly sbbService = inject(SbbService);

  public readonly aare = this.aareService.current;
  public readonly weather = this.weatherService.weather;
  public readonly weatherLoading = this.weatherService.loading;
  public readonly thun = this.sbbService.connections(() => ({ from: 'Gümligen', to: 'Thun' }));
  public readonly muri = this.sbbService.connections(() => ({
    from: 'Gümligen',
    to: 'Muri bei Bern',
  }));

  private readonly secondsElapsed = signal(0);

  public readonly timeCounter = computed(() => {
    const remaining = RELOAD_INTERVAL_SECONDS - this.secondsElapsed();
    const minutes = Math.floor(remaining / 60);
    const seconds = `${remaining % 60}`.padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  constructor() {
    interval(TICK_INTERVAL_MS)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.tick());
  }

  public reload(): void {
    this.secondsElapsed.set(0);
    this.aare.reload();
    this.weatherService.reload();
    this.thun.reload();
    this.muri.reload();
  }

  private tick(): void {
    if (this.secondsElapsed() >= RELOAD_INTERVAL_SECONDS) {
      this.reload();
    } else {
      this.secondsElapsed.update((seconds) => seconds + 1);
    }
  }
}
