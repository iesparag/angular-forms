import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-executive-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-template.component.html',
  styleUrls: ['./executive-template.component.css']
})
export class ExecutiveTemplateComponent {
  @Input() resumeData: any;
}
