import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HochbeetCanvasComponent } from './hochbeet-canvas.component';

describe('HochbeetCanvasComponent', () => {
  let component: HochbeetCanvasComponent;
  let fixture: ComponentFixture<HochbeetCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HochbeetCanvasComponent]
    });
    fixture = TestBed.createComponent(HochbeetCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
