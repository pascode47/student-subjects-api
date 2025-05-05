import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'; // Import HttpResponse
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { Student } from '../components/student-list/student-list.component'; // Adjust path if needed
import { Subject } from '../components/subject-list/subject-list.component'; // Adjust path if needed

@Injectable({
  providedIn: 'root' // Provide the service at the root level
})
export class ApiService {
  // NOTE: This URL will likely need to be updated when running inside Docker
  // to point to the API service name (e.g., 'http://api:5000/api').
  // For local development outside Docker, it might be 'http://localhost:5000/api'.
  private apiUrl = '/api'; // Using relative path for proxy or direct serving

  private http = inject(HttpClient);

  // Method to get the Node ID from headers (implementation depends on SSR/CSR)
  getNodeIdFromHeaders(headers: HttpHeaders): string | null {
    // This is a placeholder. Actual implementation might differ.
    // In SSR, headers might be directly accessible.
    // In CSR, this might need to be handled differently, perhaps via an initial request
    // or by having the backend inject it into the initial HTML payload.
    // For now, we assume the header might be present in responses.
    // This method might not be the best way if the header is on the initial SSR response.
    // Keeping it simple for now.
    return headers.get('X-Node-ID');
  }

  // Fetches data and extracts the X-Node-ID header from the response
  getNodeId(): Observable<string | null> {
    // Make a request (e.g., to students endpoint) and observe the full response
    // to access headers. We map the response to extract the header.
    // Using /api/students as the target, assuming it will return the header.
    // If the API base path is different or another endpoint is better, adjust this.
    return this.http.get<any>(`${this.apiUrl}/students`, { observe: 'response' }) // Use <any> or a base response type
      .pipe(
        map((response: HttpResponse<any>) => response.headers.get('X-Node-ID')) // Add explicit type HttpResponse<any> and Extract header
      );
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
    // Example of how to potentially get headers if needed later:
    // return this.http.get<Student[]>(`${this.apiUrl}/students`, { observe: 'response' });
    // Then process response.headers and response.body
  }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects`);
  }
}
