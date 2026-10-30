import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SbbConnection, SbbConnectionsResponse } from '../../services/sbb.service';
import { epochSecondsToMilliseconds } from '../../shared/time';

interface ConnectionView {
  fromStation: string | null;
  toStation: string | null;
  /** Epoch milliseconds. */
  departure: number | null;
  departureDelay: string;
  departurePlatform: string | null;
  /** Epoch milliseconds. */
  arrival: number | null;
  arrivalDelay: string;
  arrivalPlatform: string | null;
}

@Component({
  selector: 'app-connection',
  imports: [DatePipe],
  templateUrl: './connection.html',
  styleUrl: './connection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Connection {
  public readonly connectionData = input<SbbConnectionsResponse | null>(null);

  public readonly connections = computed<ConnectionView[]>(() =>
    (this.connectionData()?.connections ?? []).map(toConnectionView),
  );
}

function toConnectionView(connection: SbbConnection): ConnectionView {
  return {
    fromStation: connection.from.station.name,
    toStation: connection.to.station.name,
    departure: epochSecondsToMilliseconds(connection.from.departureTimestamp),
    departureDelay: delayString(connection.from.delay),
    departurePlatform: connection.from.platform,
    arrival: epochSecondsToMilliseconds(connection.to.arrivalTimestamp),
    arrivalDelay: delayString(connection.to.delay),
    arrivalPlatform: connection.to.platform,
  };
}

function delayString(delay: number | null): string {
  return delay ? `(+${delay})` : '';
}
