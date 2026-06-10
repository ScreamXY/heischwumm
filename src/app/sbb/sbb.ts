import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { SbbQuery, SbbService } from '../services/sbb.service';
import { ProgressSpinner } from '../shared/progress-spinner/progress-spinner';
import { Connection } from './connection/connection';

const SEARCH_DEBOUNCE_MS = 500;

@Component({
  selector: 'app-sbb',
  imports: [FormsModule, Connection, ProgressSpinner],
  templateUrl: './sbb.html',
  styleUrl: './sbb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sbb {
  private readonly sbbService = inject(SbbService);

  public readonly from = signal('');
  public readonly to = signal('');

  private readonly query = computed<SbbQuery | null>(() => {
    const from = this.from().trim();
    const to = this.to().trim();
    if (!from || !to) {
      return null;
    }
    return { from, to };
  });

  private readonly debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
    { initialValue: null },
  );

  public readonly connections = this.sbbService.connections(this.debouncedQuery);
}
