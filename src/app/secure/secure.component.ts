import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { HochbeetCanvasComponent } from './hochbeet-canvas/hochbeet-canvas.component';
import { SingleHochbeetComponent } from './single-hochbeet/single-hochbeet.component';

import { HochbeetApiActions } from '../state/hochbeet.actions';
import { selectHochbeetList } from '../state/hochbeet.selectors';
import { PlantsApiActions } from '../state/plants.actions';
import { selectPlants } from '../state/plants.selectors';
import { HochbeetService } from './services/hochbeet.service';
import { PlantsService } from './services/plants.service';

import { Auth } from 'aws-amplify';
@Component({
  standalone: true,
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss'],
  imports: [
    CommonModule,
    HochbeetCanvasComponent,
    SingleHochbeetComponent,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class SecureComponent implements OnInit, OnDestroy {
  plants$ = this.store.select(selectPlants);
  hochbeetList$? = this.store.select(selectHochbeetList);

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private store: Store,
    private plantsService: PlantsService,
    private hochbeetService: HochbeetService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.loadHochbeete();
    this.loadPlants();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  loadHochbeete() {
    // this.store.dispatch(loadAllHochbeete());
    this.hochbeetService
      .loadHochbeetList()
      .subscribe((hochbeetList) =>
        this.store.dispatch(
          HochbeetApiActions.retrievedHochbeetList({ hochbeetList })
        )
      );
  }
  loadPlants() {
    this.plantsService
      .loadPlants()
      .subscribe((plants) =>
        this.store.dispatch(PlantsApiActions.retrievedPlantsList({ plants }))
      );
  }

  logout() {
    Auth.signOut();
  }
}
