import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Visual stand-in for the AngularJS Material indeterminate
 * `md-progress-circular` this app used before the migration.
 */
@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinner {
  public readonly diameter = input(80);

  public readonly borderWidth = computed(() => Math.round(this.diameter() / 10));
}
