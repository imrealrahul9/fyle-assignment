import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  workoutTypes: string[] = ['Running', 'Jogging', 'Weight', 'Abs'];

  constructor(private fb: FormBuilder, private workoutService: WorkoutService) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required], // Changed to single value
      workoutMinutes: [, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const formValues = this.workoutForm.value;
      const workout: Workout = {
        userName: formValues.userName,
        workoutTypes: [formValues.workoutType], 
        workoutMinutes: formValues.workoutMinutes
      };
      this.workoutService.addWorkout(workout);
      this.workoutForm.reset();
    }
  }
}
