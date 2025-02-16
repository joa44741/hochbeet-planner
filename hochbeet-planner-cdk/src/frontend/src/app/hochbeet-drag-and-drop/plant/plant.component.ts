import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeederType, Plant, PlantInBeet } from '../../../../../shared/types';

@Component({
  selector: 'app-plant',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    CdkDrag
  ],
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent {
  feederColors: Record<FeederType, string> = {
    WEAK: 'rgb(222, 255, 222)',
    MEDIUM: 'rgb(253, 253, 208)',
    STRONG: 'rgb(247, 172, 172)'
  };

  @Input()
  plant!: Plant;
  @Input()
  plantInBeet!: PlantInBeet;
  @Input()
  sizeFactor!: number;
  @Input()
  hasWarning = false;

  @Output()
  addPlant = new EventEmitter<PlantInBeet>();
  @Output()
  removePlant = new EventEmitter<PlantInBeet>();
  @Output()
  dragEnded = new EventEmitter<CdkDragEnd>();
}
