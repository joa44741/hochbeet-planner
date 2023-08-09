import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth, Hub } from 'aws-amplify';
import { Observable, map, switchMap } from 'rxjs';
import { HochbeetService } from './hochbeet-drag-and-drop/services/hochbeet.service';
import { PlantsService } from './hochbeet-drag-and-drop/services/plants.service';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { HochbeetApiActions } from './state/hochbeet.actions';
import { PlantsApiActions } from './state/plants.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'hochbeet-planner';
  mobileQuery: MediaQueryList;
  isLoggedIn = false;

  private _mobileQueryListener: () => void;

  constructor(
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private plantsService: PlantsService,
    private hochbeetService: HochbeetService,
    private store: Store
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.onSignedIn();
      })
      .catch((error) => console.warn(error));
    Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signIn') {
        this.onSignedIn();
      }
      if (event === 'signOut') {
        this.isLoggedIn = false;
      }
    });
  }

  private onSignedIn() {
    this.isLoggedIn = true;

    this.loadPlants()
      .pipe(switchMap(() => this.loadHochbeete()))
      .subscribe(() => console.log('loaded'));
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout() {
    Auth.signOut();
  }
  login() {
    this.matDialog.open(LoginModalComponent);
  }

  private loadPlants(): Observable<void> {
    return this.plantsService.loadPlants().pipe(
      map((plants) => {
        console.log('loaded plants', { plants });
        return this.store.dispatch(
          PlantsApiActions.retrievedPlantsList({ plants })
        );
      })
    );
  }

  private loadHochbeete(): Observable<void> {
    return this.hochbeetService.loadHochbeetList().pipe(
      map((hochbeetList) => {
        return this.store.dispatch(
          HochbeetApiActions.retrievedHochbeetList({ hochbeetList })
        );
      })
    );
  }
}
