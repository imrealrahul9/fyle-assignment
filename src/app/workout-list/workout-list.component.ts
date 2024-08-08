import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'workoutType', 'workoutMinutes'];
  dataSource = new MatTableDataSource<Workout>([]);
  searchControl = new FormControl('');
  workoutTypeFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  workoutTypes: string[] = ['Running', 'Jogging', 'Weight', 'Abs'];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.dataSource.data = workouts;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.applyFilter();
    });

    this.workoutTypeFilter.valueChanges.subscribe(type => {
      this.dataSource.filterPredicate = (data: Workout, filter: string) => {
        return type ? data.workoutTypes.includes(type) : true;
      };
      this.dataSource.filter = type ? type : '';
    });
  }

  applyFilter(): void {
    const filterValue = this.searchControl.value ? this.searchControl.value.trim().toLowerCase() : '';
    this.dataSource.filterPredicate = (data: Workout, filter: string) => {
      return data.userName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
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
