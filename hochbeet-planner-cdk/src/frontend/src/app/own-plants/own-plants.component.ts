import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-own-plants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './own-plants.component.html',
  styleUrl: './own-plants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwnPlantsComponent {}
