import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlantToHochbeetDialogComponent } from './add-plant-to-hochbeet-dialog.component';

describe('AddPlantToHochbeetDialogComponent', () => {
  let component: AddPlantToHochbeetDialogComponent;
  let fixture: ComponentFixture<AddPlantToHochbeetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddPlantToHochbeetDialogComponent]
    });
    fixture = TestBed.createComponent(AddPlantToHochbeetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
