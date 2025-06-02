import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    // Replace with your actual email sending endpoint
    const endpoint = '/api/send-email';
    return this.http.post(endpoint, emailData);
  }
}
