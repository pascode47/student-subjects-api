import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service'; // Adjust path if needed
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

export interface Student {
  _id: string; // Assuming MongoDB ObjectId
  name: string;
  program: string;
  // Add other relevant fields if needed
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Add HttpClientModule here
  providers: [ApiService], // Provide ApiService here if not provided globally
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  isLoading = true;
  error: string | null = null;

  private apiService = inject(ApiService);

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getStudents().subscribe({
      next: (data: any) => { // Add explicit type 'any'
        // Assuming data is an array of students. Adjust if the API returns an object.
        this.students = Array.isArray(data) ? data.slice(0, 10) : [];
        this.isLoading = false;
      },
      error: (err: any) => { // Add explicit type 'any'
        console.error('Error fetching students:', err);
        this.error = 'Failed to load students. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
