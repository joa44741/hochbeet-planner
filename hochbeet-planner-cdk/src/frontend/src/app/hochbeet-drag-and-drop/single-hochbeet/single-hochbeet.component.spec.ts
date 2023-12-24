import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHochbeetComponent } from './single-hochbeet.component';

describe('SingleHochbeetComponent', () => {
  let component: SingleHochbeetComponent;
  let fixture: ComponentFixture<SingleHochbeetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SingleHochbeetComponent]
    });
    fixture = TestBed.createComponent(SingleHochbeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
