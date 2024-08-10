import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['userName', 'workoutType', 'workoutTypeCount','workoutMinutes'];
  dataSource: MatTableDataSource<Workout> = new MatTableDataSource<Workout>();
  searchControl: FormControl = new FormControl();
  workoutTypeFilter: FormControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  workoutTypes: string[] = ['Running', 'Jogging', 'Weight', 'Abs'];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.dataSource.data = workouts;
    });
  
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.applyFilter();
    });
  
    this.workoutTypeFilter.valueChanges.subscribe(type => {
      this.applyFilter();
    });
  
    this.dataSource.filterPredicate = (data: Workout, filter: string) => {
      const searchTerm = filter.split(' ')[0];
      const workoutType = filter.split(' ')[1];
  
      const matchesSearchTerm = data.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWorkoutType = workoutType ? data.workoutTypes.includes(workoutType) : true;
  
      return matchesSearchTerm && matchesWorkoutType;
    };
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(): void {
    const searchTerm = this.searchControl.value ? this.searchControl.value.trim().toLowerCase() : '';
    const workoutType = this.workoutTypeFilter.value ? this.workoutTypeFilter.value : '';
    this.dataSource.filter = `${searchTerm} ${workoutType}`;
  }


  applyTypeFilter(type: string): void {
    this.dataSource.filterPredicate = (data: Workout, filter: string) => {
      const matchFilter = type ? data.workoutTypes.includes(type) : true;
      return matchFilter && data.userName.toLowerCase().includes(filter.toLowerCase());
    };
    const searchValue = this.searchControl.value;
    if (searchValue) {
      this.dataSource.filter = searchValue.trim().toLowerCase();
    }
  }
}
