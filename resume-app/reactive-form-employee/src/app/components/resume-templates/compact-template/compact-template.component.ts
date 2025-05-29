import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compact-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compact-template.component.html',
  styleUrls: ['./compact-template.component.css']
})
export class CompactTemplateComponent {
  @Input() resumeData: any;
}
