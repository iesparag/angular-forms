import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ResumeEditorComponent } from './components/resume-editor/resume-editor.component';
import { ModernTemplateComponent } from './components/resume-templates/modern-template/modern-template.component';
import { CreativeTemplateComponent } from './components/resume-templates/creative-template/creative-template.component';
import { MinimalTemplateComponent } from './components/resume-templates/minimal-template/minimal-template.component';
import { ProfessionalTemplateComponent } from './components/resume-templates/professional-template/professional-template.component';
import { ExecutiveTemplateComponent } from './components/resume-templates/executive-template/executive-template.component';
import { TechnicalTemplateComponent } from './components/resume-templates/technical-template/technical-template.component';
import { CompactTemplateComponent } from './components/resume-templates/compact-template/compact-template.component';
import { RatingTemplateComponent } from './components/resume-templates/rating-template/rating-template.component';
import { TimelineTemplateComponent } from './components/resume-templates/timeline-template/timeline-template.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    AppComponent,
    ResumeEditorComponent,
    ModernTemplateComponent,
    CreativeTemplateComponent,
    MinimalTemplateComponent,
    ProfessionalTemplateComponent,
    ExecutiveTemplateComponent,
    TechnicalTemplateComponent,
    CompactTemplateComponent,
    RatingTemplateComponent,
    TimelineTemplateComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
