import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service'; // Adjust path if needed
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

export interface Subject {
  _id: string;
  name: string;
  year: number;
  // Removed code and program as they are not in the API response
}

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Add HttpClientModule here
  providers: [ApiService], // Provide ApiService here if not provided globally
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  isLoading = true;
  error: string | null = null;
  // Removed targetProgram as filtering is removed

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getSubjects().subscribe({
      next: (response: any) => { // Changed variable name for clarity
        // Access the 'subjects' array within the response object
        // Assign directly as filtering is removed
        this.subjects = response && Array.isArray(response.subjects) ? response.subjects : [];
        this.isLoading = false;
      },
      error: (err: any) => { // Add explicit type 'any'
        console.error('Error fetching subjects:', err);
        this.error = 'Failed to load subjects. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
