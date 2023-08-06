import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HochbeetDragAndDropComponent } from './hochbeet-drag-and-drop.component';

describe('HochbeetDragAndDropComponent', () => {
  let component: HochbeetDragAndDropComponent;
  let fixture: ComponentFixture<HochbeetDragAndDropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HochbeetDragAndDropComponent]
    });
    fixture = TestBed.createComponent(HochbeetDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
