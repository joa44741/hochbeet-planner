import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHochbeetDialogComponent } from './new-hochbeet-dialog.component';

describe('NewHochbeetDialogComponent', () => {
  let component: NewHochbeetDialogComponent;
  let fixture: ComponentFixture<NewHochbeetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewHochbeetDialogComponent]
    });
    fixture = TestBed.createComponent(NewHochbeetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
