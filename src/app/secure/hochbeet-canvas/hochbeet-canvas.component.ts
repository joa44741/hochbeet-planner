import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hochbeet-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hochbeet-canvas.component.html',
  styleUrls: ['./hochbeet-canvas.component.scss']
})
export class HochbeetCanvasComponent {
  hochbeete = [{ width: 185 * 3, height: 85 * 3, name: 'Beet 1' }];
  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
  }
}
