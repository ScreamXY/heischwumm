import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SbbConnectionsResponse } from '../../services/sbb.service';

@Component({
  selector: 'app-connection',
  imports: [DatePipe],
  templateUrl: './connection.html',
  styleUrl: './connection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Connection {
  public readonly connectionData = input<SbbConnectionsResponse | null>(null);

  public delayString(delay: number | null): string {
    if (delay) {
      return `(+${delay})`;
    }
    return '';
  }

  public toDate(timestamp: number | null): Date | null {
    if (timestamp === null) {
      return null;
    }
    return new Date(timestamp * 1000);
  }
}
