import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResumeFormComponent } from './components/resume-form/resume-form.component';
import { TemplatePreviewComponent } from './components/template-preview/template-preview.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'template/:type', component: TemplatePreviewComponent },
  { path: 'resume-form', component: ResumeFormComponent },
  { path: '**', component: NotFoundComponent },
];
