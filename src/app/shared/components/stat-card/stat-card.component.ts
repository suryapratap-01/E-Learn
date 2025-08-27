import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stat-card',
  imports: [CommonModule],
  template: `
    <div class="stat">
      <div class="t">{{ title }}</div>
      <div class="v">{{ value }}</div>
      <div class="c">{{ cta }}</div>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: number | string = '';
  @Input() cta = '';
}
