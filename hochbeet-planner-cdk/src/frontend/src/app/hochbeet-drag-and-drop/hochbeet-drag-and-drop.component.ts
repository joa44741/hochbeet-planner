import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { SingleHochbeetComponent } from './single-hochbeet/single-hochbeet.component';

import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { Hochbeet } from '../../../../shared/types';
import { HochbeetAction } from '../state/hochbeet.actions';
import {
  selectHochbeetList,
  selectIsLoading
} from '../state/hochbeet.selectors';
import { selectPlants } from '../state/plants.selectors';
import { NewHochbeetDialogComponent } from './new-hochbeet-dialog/new-hochbeet-dialog.component';

@Component({
  standalone: true,
  templateUrl: './hochbeet-drag-and-drop.component.html',
  styleUrls: ['./hochbeet-drag-and-drop.component.scss'],
  imports: [
    CommonModule,
    SingleHochbeetComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ]
})
export class HochbeetDragAndDropComponent {
  plants$ = this.store.select(selectPlants);
  hochbeetList$? = this.store.select(selectHochbeetList);
  isLoading$? = this.store.select(selectIsLoading);

  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {}

  addHochbeet() {
    const dialogResult$: Observable<{
      name: string;
      width: number;
      height: number;
    }> = this.matDialog.open(NewHochbeetDialogComponent).afterClosed();

    dialogResult$.subscribe((result) => {
      if (!result) {
        return;
      }
      this.hochbeetList$?.pipe(take(1)).subscribe((hochbeetList) => {
        const maxBeetNumber =
          hochbeetList.length > 0
            ? Math.max(...hochbeetList.map((hochbeet) => hochbeet.beetNumber))
            : 0;
        const newBeet: Hochbeet = {
          userId: 'unpersisted',
          beetNumber: maxBeetNumber + 1,
          name: result.name,
          width: result.width,
          height: result.height,
          plantsInBeet: []
        };
        this.store.dispatch(
          HochbeetAction.createHochbeet({ hochbeet: newBeet })
        );
      });
    });
  }
}
