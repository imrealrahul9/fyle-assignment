import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatOptionModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';  // Added for sorting functionality

import { AppComponent } from './app.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { WorkoutChartComponent } from './workout-chart/workout-chart.component';
import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [
  { path: '', component: WorkoutFormComponent }, // Default route
  { path: 'list', component: WorkoutListComponent },
  { path: 'chart', component: WorkoutChartComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WorkoutFormComponent,
    WorkoutListComponent,
    WorkoutChartComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,  // Added for sorting functionality
    BrowserAnimationsModule,
    RouterModule.forRoot(routes) // Configure routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
