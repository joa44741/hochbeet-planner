import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TrackByFunction
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectPlants } from 'src/app/state/plants.selectors';
import { FeederType, Hochbeet, Plant, PlantInBeet } from '../../types';
import { isPlantInBeetIncluded, plantInBeetEqual } from '../plant-in-beet-util';
import { CollisionDetectorService } from '../services/collision-detector.service';

@Component({
  selector: 'app-single-hochbeet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CdkDrag,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './single-hochbeet.component.html',
  styleUrls: ['./single-hochbeet.component.scss']
})
export class SingleHochbeetComponent implements OnInit {
  sizeFactor = 5;
  plants$ = this.store.select(selectPlants);

  @Input()
  hochbeet!: Hochbeet;

  feederColors: Record<FeederType, string> = {
    WEAK: 'rgb(222, 255, 222)',
    MEDIUM: 'rgb(253, 253, 208)',
    STRONG: 'rgb(247, 172, 172)'
  };

  resizedPlantsInBeet: PlantInBeet[] = [];

  constructor(
    private collisionDetectorService: CollisionDetectorService,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store
  ) {}

  hasWarning(plantInBeet: PlantInBeet) {
    return (
      this.collisionDetectorService.warnings.findIndex((warning) =>
        isPlantInBeetIncluded(plantInBeet, warning.affectedPlants)
      ) !== -1
    );
  }

  alignSelectedToLeft() {
    const selectedPlantsInBeet = this.resizedPlantsInBeet.filter(
      (p) => p.selected === true
    );
    const minX = Math.min(...selectedPlantsInBeet.map((p) => p.position.x));
    selectedPlantsInBeet.forEach((p) => {
      p.position.x = minX;
      p.selected = false;
    });
    this.detectCollisions();
  }

  alignSelectedToRight() {
    const selectedPlantsInBeet = this.resizedPlantsInBeet.filter(
      (p) => p.selected === true
    );
    const maxX = Math.max(
      ...selectedPlantsInBeet.map(
        (p) => p.position.x + p.plant.width * this.sizeFactor
      )
    );
    selectedPlantsInBeet.forEach((p) => {
      p.position.x = maxX - p.plant.width * this.sizeFactor;
      p.selected = false;
    });
    this.detectCollisions();
  }

  private loadPlantsInBeet() {
    this.resizedPlantsInBeet = [...this.hochbeet.plantsInBeet];
    console.log(this.resizedPlantsInBeet);
    this.adjustPositions(1, this.sizeFactor);
  }

  isAlignButtonDisabled() {
    return (
      this.resizedPlantsInBeet.filter(
        (plantInBeet) => plantInBeet.selected === true
      ).length < 2
    );
  }

  dragEnded(event: CdkDragEnd) {
    const droppedPlantInBeet: PlantInBeet = event.source.data;
    const foundPlantInBeet = this.resizedPlantsInBeet.find((plantInBeet) =>
      plantInBeetEqual(plantInBeet, droppedPlantInBeet)
    )!;
    foundPlantInBeet.position = event.source.getFreeDragPosition();
    // console.log(foundPlantInBeet.position);

    this.detectCollisions();
  }

  warningsToStrings() {
    return this.collisionDetectorService.warnings.map((warning) => {
      const plantNamesAndNumbers = warning.affectedPlants
        .map(
          (plantInBeet) =>
            `${plantInBeet.plant.plantName} (${plantInBeet.plantNumber})`
        )
        .join(', ');
      return `${warning.warningReason}: ${plantNamesAndNumbers}`;
    });
  }

  trackByPlant: TrackByFunction<PlantInBeet> = (index, plantInBeet) =>
    plantInBeet.plant.plantName + plantInBeet.plantNumber;

  ngOnInit(): void {
    this.loadPlantsInBeet();
    this.detectCollisions();
  }

  increaseSize() {
    const oldSizeFactor = this.sizeFactor;
    this.sizeFactor++;
    this.adjustPositions(oldSizeFactor, this.sizeFactor);
  }
  decreaseSize() {
    if (this.sizeFactor > 1) {
      const oldSizeFactor = this.sizeFactor;
      this.sizeFactor--;
      this.adjustPositions(oldSizeFactor, this.sizeFactor);
    }
  }

  private adjustPositions(oldSizeFactor: number, newSizeFactor: number) {
    this.resizedPlantsInBeet = this.resizedPlantsInBeet.map((plantInBeet) => {
      return {
        ...plantInBeet,
        position: {
          x: Math.round(
            (plantInBeet.position.x / oldSizeFactor) * newSizeFactor
          ),
          y: Math.round(
            (plantInBeet.position.y / oldSizeFactor) * newSizeFactor
          )
        }
      };
    });
  }

  addPlant(plant: Plant) {
    const plantNumbers = this.resizedPlantsInBeet
      .filter((plantInBeet) => plantInBeet.plant.plantName === plant.plantName)
      .map((plantInBeet) => plantInBeet.plantNumber);
    const maxPlantNumber =
      plantNumbers.length > 0
        ? Math.max(
            ...this.resizedPlantsInBeet
              .filter(
                (plantInBeet) => plantInBeet.plant.plantName === plant.plantName
              )
              .map((plantInBeet) => plantInBeet.plantNumber)
          )
        : 0;

    const newPlantInBeet = {
      plantNumber: maxPlantNumber + 1,
      plant,
      position: { x: 0, y: 0 }
    };
    this.resizedPlantsInBeet.push(newPlantInBeet);
    this.detectCollisions();
    this.changeDetectorRef.detectChanges();
  }

  removePlant(plantInBeet: PlantInBeet) {
    const indexOfObject = this.resizedPlantsInBeet.findIndex((object) => {
      return object === plantInBeet;
    });
    if (indexOfObject !== -1) {
      this.resizedPlantsInBeet.splice(indexOfObject, 1);
      this.detectCollisions();
    }
  }
  private detectCollisions() {
    this.collisionDetectorService.updateWarnings(
      this.resizedPlantsInBeet,
      this.sizeFactor
    );
  }
}
