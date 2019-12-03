import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToneAnalyzerService {

  /**
   * Constructor
   * @param http Client for making HTTP requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Submits a post request to the backend API endpoint for tone analysis
   * @param data The message content to be analyzed
   * @returns Observable of the response
   */
  toneAnalyze(data: string): Observable<any> {
    return this.http.post(`${environment.uri}/api/tone`, { text: data });
  }

}
