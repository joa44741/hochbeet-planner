import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { SingleHochbeetComponent } from './single-hochbeet/single-hochbeet.component';

import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Observable, take } from 'rxjs';
import { HochbeetAction } from '../state/hochbeet.actions';
import { selectHochbeetList } from '../state/hochbeet.selectors';
import { selectPlants } from '../state/plants.selectors';
import { Hochbeet } from '../types';
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
    MatCardModule
  ]
})
export class HochbeetDragAndDropComponent implements OnInit {
  plants$ = this.store.select(selectPlants);
  hochbeetList$? = this.store.select(selectHochbeetList);

  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {}
  ngOnInit(): void {}

  addHochbeet() {
    const dialogResult$: Observable<{
      name: string;
      width: number;
      height: number;
    }> = this.matDialog.open(NewHochbeetDialogComponent).afterClosed();

    dialogResult$.subscribe((result) => {
      this.hochbeetList$?.pipe(take(1)).subscribe((hochbeetList) => {
        const maxBeetNumber =
          hochbeetList.length > 0
            ? Math.max(...hochbeetList.map((hochbeet) => hochbeet.beetNumber))
            : 0;
        const newBeet: Hochbeet = {
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
