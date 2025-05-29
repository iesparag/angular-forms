import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-technical-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technical-template.component.html',
  styleUrls: ['./technical-template.component.css']
})
export class TechnicalTemplateComponent {
  @Input() resumeData: any;
}
