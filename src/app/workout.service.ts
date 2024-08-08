import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workout } from './workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.loadWorkoutsFromSessionStorage());
  workouts$ = this.workoutsSubject.asObservable();

  private workouts: Workout[] = this.loadWorkoutsFromSessionStorage();

  constructor() {
    this.workoutsSubject.next(this.workouts);
  }

  addWorkout(workout: Workout): void {
    // Find if the user already exists
    const existingWorkout = this.workouts.find(w => w.userName === workout.userName);
    
    if (existingWorkout) {
      // Update the existing workout
      workout.workoutTypes.forEach(type => {
        if (!existingWorkout.workoutTypes.includes(type)) {
          existingWorkout.workoutTypes.push(type);
        }
      });
      existingWorkout.workoutMinutes += workout.workoutMinutes;
    } else {
      // Add new workout
      this.workouts.push(workout);
    }

    // Save to session storage
    this.saveWorkoutsToSessionStorage(this.workouts);

    // Notify subscribers about the update
    this.workoutsSubject.next(this.workouts);
  }

  getWorkouts() {
    return this.workouts$;
  }

  private loadWorkoutsFromSessionStorage(): Workout[] {
    const workouts = sessionStorage.getItem('workouts');
    return workouts ? JSON.parse(workouts) : [];
  }

  private saveWorkoutsToSessionStorage(workouts: Workout[]): void {
    sessionStorage.setItem('workouts', JSON.stringify(workouts));
  }
}
