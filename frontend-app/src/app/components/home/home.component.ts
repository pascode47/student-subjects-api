import { Component, OnInit, inject } from '@angular/core'; // Import OnInit and inject
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service'; // Import ApiService
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule], // Add HttpClientModule
  providers: [ApiService], // Provide ApiService locally or ensure it's providedIn: 'root'
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { // Implement OnInit
  nodeId: string | null = null;
  isLoadingNodeId = true; // Add loading state

  private apiService = inject(ApiService); // Inject ApiService

  ngOnInit(): void { // Implement ngOnInit
    this.fetchNodeId();
  }

  fetchNodeId(): void {
    this.isLoadingNodeId = true;
    this.apiService.getNodeId().subscribe({
      next: (id: string | null) => { // Add explicit type
        this.nodeId = id;
        this.isLoadingNodeId = false;
      },
      error: (err: any) => { // Add explicit type
        console.error('Error fetching Node ID:', err);
        this.nodeId = 'Error fetching ID'; // Display error message
        this.isLoadingNodeId = false;
      }
    });
  }
}
