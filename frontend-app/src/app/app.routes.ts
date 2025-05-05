import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Default route
  { path: 'students', component: StudentListComponent },
  { path: 'subjects', component: SubjectListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route redirects to home
];
