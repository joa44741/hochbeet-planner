import { CdkDragEnd } from '@angular/cdk/drag-drop';
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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HochbeetAction } from 'src/app/state/hochbeet.actions';
import { selectPlants } from 'src/app/state/plants.selectors';
import { FeederType, Hochbeet, Plant, PlantInBeet } from '../../types';
import { AddPlantToHochbeetDialogComponent } from '../add-plant-to-hochbeet-dialog/add-plant-to-hochbeet-dialog.component';
import { isPlantInBeetIncluded, plantInBeetEqual } from '../plant-in-beet-util';
import { PlantComponent } from '../plant/plant.component';
import { CollisionDetectorService } from '../services/collision-detector.service';

@Component({
  selector: 'app-single-hochbeet',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    PlantComponent
  ],
  templateUrl: './single-hochbeet.component.html',
  styleUrls: ['./single-hochbeet.component.scss']
})
export class SingleHochbeetComponent implements OnInit {
  sizeFactor = 5;
  plants$ = this.store.select(selectPlants);
  loadedPlants: Record<string, Plant> = {};

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
    private store: Store,
    private matDialog: MatDialog
  ) {}

  hasWarning(plantInBeet: PlantInBeet) {
    return (
      this.collisionDetectorService.warnings[
        this.hochbeet.beetNumber
      ]?.findIndex((warning) =>
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

  openAddPlantDialog() {
    this.matDialog
      .open(AddPlantToHochbeetDialogComponent, {})
      .afterClosed()
      .subscribe((plantName) => {
        this.addPlant(plantName);
      });
  }

  getPlantByName(plantName: string): Plant {
    const plant = this.loadedPlants[plantName];
    return plant;
  }

  save() {
    this.hochbeet = {
      ...this.hochbeet,
      plantsInBeet: this.adjustPositions(
        this.resizedPlantsInBeet,
        this.sizeFactor,
        1
      )
    };
    console.log(this.hochbeet.plantsInBeet);
    this.store.dispatch(
      HochbeetAction.saveHochbeet({ hochbeet: this.hochbeet })
    );
  }

  alignSelectedToRight() {
    const selectedPlantsInBeet = this.resizedPlantsInBeet.filter(
      (p) => p.selected === true
    );
    const maxX = Math.max(
      ...selectedPlantsInBeet.map(
        (p) =>
          p.position.x +
          this.getPlantByName(p.plantName).width * this.sizeFactor
      )
    );
    selectedPlantsInBeet.forEach((p) => {
      p.position.x =
        maxX - this.getPlantByName(p.plantName).width * this.sizeFactor;
      p.selected = false;
    });
    this.detectCollisions();
  }

  private resizePlantsInBeetWhenLoadedFirst() {
    this.resizedPlantsInBeet = this.adjustPositions(
      this.hochbeet.plantsInBeet,
      1,
      this.sizeFactor
    );
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
    console.log(foundPlantInBeet.position);

    this.detectCollisions();
  }

  warningsToStrings() {
    return this.collisionDetectorService.warnings[
      this.hochbeet.beetNumber
    ]?.map((warning) => {
      const plantNamesAndNumbers = warning.affectedPlants
        .map(
          (plantInBeet) =>
            `${plantInBeet.plantName} (${plantInBeet.plantNumber})`
        )
        .join(', ');
      return `${warning.warningReason}: ${plantNamesAndNumbers}`;
    });
  }

  trackByPlant: TrackByFunction<PlantInBeet> = (index, plantInBeet) =>
    plantInBeet.plantName + plantInBeet.plantNumber;

  ngOnInit(): void {
    this.plants$.subscribe((plants) => {
      if (plants) {
        const plantNamesToPlant: Record<string, Plant> = {};
        plants.forEach((plant) => {
          plantNamesToPlant[plant.plantName] = plant;
        });
        this.loadedPlants = plantNamesToPlant;
        this.resizePlantsInBeetWhenLoadedFirst();
        this.detectCollisions();
      }
    });
  }

  increaseSize() {
    const oldSizeFactor = this.sizeFactor;
    this.sizeFactor++;
    this.resizedPlantsInBeet = this.adjustPositions(
      this.resizedPlantsInBeet,
      oldSizeFactor,
      this.sizeFactor
    );
  }
  decreaseSize() {
    if (this.sizeFactor > 1) {
      const oldSizeFactor = this.sizeFactor;
      this.sizeFactor--;
      this.resizedPlantsInBeet = this.adjustPositions(
        this.resizedPlantsInBeet,
        oldSizeFactor,
        this.sizeFactor
      );
    }
  }

  private adjustPositions(
    plantsInBeet: PlantInBeet[],
    oldSizeFactor: number,
    newSizeFactor: number
  ) {
    return plantsInBeet.map((plantInBeet) => {
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

  addPlant(plantName: string) {
    const plantNumbers = this.resizedPlantsInBeet
      .filter((plantInBeet) => plantInBeet.plantName === plantName)
      .map((plantInBeet) => plantInBeet.plantNumber);
    const maxPlantNumber =
      plantNumbers.length > 0
        ? Math.max(
            ...this.resizedPlantsInBeet
              .filter((plantInBeet) => plantInBeet.plantName === plantName)
              .map((plantInBeet) => plantInBeet.plantNumber)
          )
        : 0;

    const newPlantInBeet = {
      plantNumber: maxPlantNumber + 1,
      plantName: plantName,
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
      this.hochbeet.beetNumber,
      this.loadedPlants,
      this.resizedPlantsInBeet,
      this.sizeFactor
    );
  }
}
