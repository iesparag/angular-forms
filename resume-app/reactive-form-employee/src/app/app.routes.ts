import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResumeFormComponent } from './components/resume-form/resume-form.component';
import { TemplatePreviewComponent } from './components/template-preview/template-preview.component';
import { ResumeEditorComponent } from './components/resume-editor/resume-editor.component';
import { LoginComponent } from './components/auth/login/login.component';
import { GoogleCallbackComponent } from './components/auth/google-callback/google-callback.component';

// Ensure all components are properly exported from their respective files
import { AuthGuard } from './guards/auth.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'template/:type', component: TemplatePreviewComponent },
  { 
    path: 'editor/:type', 
    component: ResumeEditorComponent,
    canActivate: [AuthGuard]
  },
  { path: 'resume-form', component: ResumeFormComponent },
  { path: 'auth/google-callback', component: GoogleCallbackComponent },
  { 
    path: 'auth', 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent }
    ]
  },
  { path: '**', component: NotFoundComponent },
];
