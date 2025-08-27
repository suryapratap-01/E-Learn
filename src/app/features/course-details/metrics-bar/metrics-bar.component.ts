import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-metrics-bar',
  imports: [CommonModule],
  template: `
    <div class="metrics">
      <div class="item">
        <div class="k">Level</div>
        <div class="v">{{ level }}</div>
      </div>
      <div class="sep"></div>
      <div class="item">
        <div class="k">Rating</div>
        <div class="v">
          {{ rating }} ★ <span class="muted">({{ reviews }} reviews)</span>
        </div>
      </div>
      <div class="sep"></div>
      <div class="item">
        <div class="k">Duration</div>
        <div class="v">{{ duration }}</div>
      </div>
      <div class="sep"></div>
      <div class="item">
        <div class="k">Flexible Schedule</div>
        <div class="v">Learn at your own pace</div>
      </div>
    </div>
  `,
  styleUrls: ['./metrics-bar.component.scss'],
})
export class MetricsBarComponent {
  @Input() level = '';
  @Input() rating = 0;
  @Input() reviews = 0;
  @Input() duration = ''; // e.g., "05 Weeks" or "13h"
}
