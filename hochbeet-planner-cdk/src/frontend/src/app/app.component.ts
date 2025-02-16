import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Auth, Hub } from 'aws-amplify';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { PlantsActions } from './state/plants.actions';
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
    RouterModule,
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
    private store: Store
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
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
    this.store.dispatch(
      PlantsActions.loadPlants({ loggedIn: this.isLoggedIn })
    );
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
}
