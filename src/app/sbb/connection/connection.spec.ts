import { formatDate } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbConnectionsResponse } from '../../services/sbb.service';
import { Connection } from './connection';

const CONNECTIONS: SbbConnectionsResponse = {
  connections: [
    {
      from: {
        station: { name: 'Gümligen' },
        departureTimestamp: 1781088960,
        arrivalTimestamp: null,
        delay: 1,
        platform: '1',
      },
      to: {
        station: { name: 'Thun' },
        departureTimestamp: null,
        arrivalTimestamp: 1781090280,
        delay: null,
        platform: '4',
      },
    },
    {
      from: {
        station: { name: 'Gümligen' },
        departureTimestamp: 1781090700,
        arrivalTimestamp: null,
        delay: null,
        platform: '1',
      },
      to: {
        station: { name: 'Thun' },
        departureTimestamp: null,
        arrivalTimestamp: 1781091960,
        delay: null,
        platform: '4',
      },
    },
  ],
};

function time(timestampSeconds: number): string {
  return formatDate(timestampSeconds * 1000, 'HH:mm', 'en-US');
}

describe('Connection', () => {
  let fixture: ComponentFixture<Connection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connection],
    }).compileComponents();
    fixture = TestBed.createComponent(Connection);
  });

  it('renders nothing without data', async () => {
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });

  it('renders the station names and the column headers only for the first connection', async () => {
    fixture.componentRef.setInput('connectionData', CONNECTIONS);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('Gümligen - Thun');
    expect(text.match(/Gümligen - Thun/g)).toHaveLength(1);
    expect(text.match(/Abfahrt/g)).toHaveLength(1);
    expect(text.match(/Ankunft/g)).toHaveLength(1);
    expect(text.match(/Gleis/g)).toHaveLength(2);
  });

  it('renders departure and arrival times, delays and platforms for every connection', async () => {
    fixture.componentRef.setInput('connectionData', CONNECTIONS);
    await fixture.whenStable();
    const text = ((fixture.nativeElement as HTMLElement).textContent ?? '').replace(/\s+/g, ' ');

    expect(text).toContain(`${time(1781088960)} (+1)`);
    expect(text).toContain(time(1781090280));
    expect(text).toContain(time(1781090700));
    expect(text).toContain(time(1781091960));
  });

  it('maps connections to a view with epoch milliseconds and delay strings', () => {
    fixture.componentRef.setInput('connectionData', CONNECTIONS);

    expect(fixture.componentInstance.connections()).toEqual([
      {
        fromStation: 'Gümligen',
        toStation: 'Thun',
        departure: 1781088960000,
        departureDelay: '(+1)',
        departurePlatform: '1',
        arrival: 1781090280000,
        arrivalDelay: '',
        arrivalPlatform: '4',
      },
      {
        fromStation: 'Gümligen',
        toStation: 'Thun',
        departure: 1781090700000,
        departureDelay: '',
        departurePlatform: '1',
        arrival: 1781091960000,
        arrivalDelay: '',
        arrivalPlatform: '4',
      },
    ]);
  });

  it('maps missing connection data to an empty list', () => {
    expect(fixture.componentInstance.connections()).toEqual([]);
  });
});
