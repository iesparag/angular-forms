import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sheet } from '../models/sheet.model';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  private sheets: Sheet[] = [];
  private sheetsSubject = new BehaviorSubject<Sheet[]>([]);
  private apiUrl = environment.apiUrl + '/api/sheets';

  constructor(private http: HttpClient) {
    this.loadSheets();
  }

  private loadSheets(): void {
    this.getSheets().subscribe();
  }

  getSheets(): Observable<Sheet[]> {
    return this.http.get<Sheet[]>(this.apiUrl).pipe(
      tap(sheets => {
        this.sheets = sheets;
        this.sheetsSubject.next(sheets);
      }),
      catchError(error => {
        console.error('Error fetching sheets:', error);
        return throwError(() => new Error('Failed to fetch sheets'));
      })
    );
  }

  getSheetById(id: string): Observable<Sheet> {
    return this.http.get<Sheet>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching sheet with id ${id}:`, error);
        return throwError(() => new Error('Failed to fetch sheet'));
      })
    );
  }

  createSheet(name: string, emails: string[] = []): Observable<Sheet> {
    const newSheet = {
      name,
      emails,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.http.post<Sheet>(this.apiUrl, newSheet).pipe(
      tap(createdSheet => {
        this.sheets.push(createdSheet);
        this.sheetsSubject.next([...this.sheets]);
      }),
      catchError(error => {
        console.error('Error creating sheet:', error);
        return throwError(() => new Error('Failed to create sheet'));
      })
    );
  }

  updateSheet(id: string, updates: Partial<Sheet>): Observable<Sheet> {
    const updatedSheet = {
      ...updates,
      updatedAt: new Date()
    };

    return this.http.put<Sheet>(`${this.apiUrl}/${id}`, updatedSheet).pipe(
      tap(sheet => {
        const index = this.sheets.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sheets[index] = sheet;
          this.sheetsSubject.next([...this.sheets]);
        }
      }),
      catchError(error => {
        console.error(`Error updating sheet with id ${id}:`, error);
        return throwError(() => new Error('Failed to update sheet'));
      })
    );
  }

  deleteSheet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const index = this.sheets.findIndex(sheet => sheet.id === id);
        if (index !== -1) {
          this.sheets.splice(index, 1);
          this.sheetsSubject.next([...this.sheets]);
        }
      }),
      catchError(error => {
        console.error(`Error deleting sheet with id ${id}:`, error);
        return throwError(() => new Error('Failed to delete sheet'));
      })
    );
  }

  // This method allows components to get the current sheets without making another HTTP request
  getCurrentSheets(): Observable<Sheet[]> {
    return this.sheetsSubject.asObservable();
  }
}
