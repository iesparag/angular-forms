import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}/api/email/send-email`;

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    if (emailData.bulk) {
      formData.append('bulk', 'true');
    }
    // Attach files
    if (emailData.attachments && emailData.attachments.length > 0) {
      for (const att of emailData.attachments) {
        if (att instanceof File) {
          formData.append('attachments', att, att.name);
        } else if (att.data && att.name && att.type) {
          // Convert base64 to Blob
          const arr = att.data.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new File([u8arr], att.name, { type: mime });
          formData.append('attachments', file, att.name);
        }
      }
    }
    return this.http.post(this.apiUrl, formData);
  }
}
