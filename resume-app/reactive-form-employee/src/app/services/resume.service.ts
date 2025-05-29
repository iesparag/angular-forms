import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = `${environment.apiUrl}/api/resumes`;

  constructor(private http: HttpClient) {}

  saveResume(resumeData: any): Observable<any> {
    return this.http.post(this.apiUrl, resumeData);
  }

  updateResume(id: string, resumeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, resumeData);
  }

  getResume(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getResumes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAllResumes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteResume(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
