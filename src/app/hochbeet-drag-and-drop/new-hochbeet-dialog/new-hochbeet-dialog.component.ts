import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-new-hochbeet-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './new-hochbeet-dialog.component.html',
  styleUrls: ['./new-hochbeet-dialog.component.scss']
})
export class NewHochbeetDialogComponent {
  newHochbeetForm = this.fb.group({
    name: ['', Validators.required],
    width: ['', Validators.required],
    height: ['', Validators.required]
  });
  constructor(
    public dialogRef: MatDialogRef<NewHochbeetDialogComponent>,
    private fb: FormBuilder
  ) {}

  onSubmit() {
    this.dialogRef.close(this.newHochbeetForm.value);
  }
}
