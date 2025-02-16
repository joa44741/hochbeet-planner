import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { selectPlants } from 'src/app/state/plants.selectors';
import { FeederType } from '../../../../../shared/types';

@Component({
  selector: 'app-add-plant-to-hochbeet-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './add-plant-to-hochbeet-dialog.component.html',
  styleUrls: ['./add-plant-to-hochbeet-dialog.component.scss']
})
export class AddPlantToHochbeetDialogComponent {
  plants$ = this.store.select(selectPlants);
  feederColors: Record<FeederType, string> = {
    WEAK: 'rgb(222, 255, 222)',
    MEDIUM: 'rgb(253, 253, 208)',
    STRONG: 'rgb(247, 172, 172)'
  };

  constructor(
    public dialogRef: MatDialogRef<AddPlantToHochbeetDialogComponent>,
    private store: Store
  ) {}

  addPlant(plantName: string) {
    this.dialogRef.close(plantName);
  }
  // addPlantToHochbeetForm = this.fb.group({
  //   plantName: ['', Validators.required],
  //   width: ['', Validators.required],
  //   height: ['', Validators.required]
  // });
  // constructor(
  //   public dialogRef: MatDialogRef<AddPlantToHochbeetDialogComponent>,
  //   private fb: FormBuilder
  // ) {}
  // onSubmit() {
  //   this.dialogRef.close(this.newHochbeetForm.value);
  // }
}
