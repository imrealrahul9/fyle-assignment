import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Workout } from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutsSubject = new BehaviorSubject<Workout[]>([]);
  workouts$: Observable<Workout[]> = this.workoutsSubject.asObservable();

  private workouts: Workout[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.workouts = this.loadWorkoutsFromSessionStorage();
      this.workoutsSubject.next(this.workouts);
    }
  }

  addWorkout(workout: Workout): void {
    const existingWorkout = this.workouts.find(w => w.userName === workout.userName);
  
    if (existingWorkout) {
      workout.workoutTypes.forEach(type => {
        if (!existingWorkout.workoutTypes.includes(type)) {
          existingWorkout.workoutTypes.push(type);
        }
      });
      existingWorkout.workoutMinutes += workout.workoutMinutes;
      existingWorkout.workoutTypeCount = existingWorkout.workoutTypes.length;
    } else {
      workout.workoutTypeCount = workout.workoutTypes.length;
      this.workouts.push(workout);
    }
  
    this.workoutsSubject.next(this.workouts);
  
    if (isPlatformBrowser(this.platformId)) {
      this.saveWorkoutsToSessionStorage();
    }
  }
  

  private loadWorkoutsFromSessionStorage(): Workout[] {
    const workouts = sessionStorage.getItem('workouts');
    return workouts ? JSON.parse(workouts) : [];
  }

  private saveWorkoutsToSessionStorage(): void {
    sessionStorage.setItem('workouts', JSON.stringify(this.workouts));
  }

  getWorkouts(): Observable<Workout[]> {
    return this.workouts$;
  }
}
