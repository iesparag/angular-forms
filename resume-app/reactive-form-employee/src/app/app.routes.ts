import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResumeFormComponent } from './components/resume-form/resume-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: 'resume-form', component: ResumeFormComponent },
  { path: '**', component: NotFoundComponent },
];
