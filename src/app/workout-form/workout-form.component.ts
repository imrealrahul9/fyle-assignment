import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.css']
})
export class WorkoutFormComponent {
  workoutForm: FormGroup;
  workoutTypes: string[] = ['Running', 'Jogging', 'Weight', 'Abs'];

  constructor(private fb: FormBuilder, private workoutService: WorkoutService,private snackBar: MatSnackBar) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required], 
      workoutMinutes: [, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.workoutForm.valid) {
      const formValues = this.workoutForm.value;
      const workout: Workout = {
        userName: formValues.userName,
        workoutTypes: [formValues.workoutType], 
        workoutMinutes: formValues.workoutMinutes,
        workoutDurations: {
          [formValues.workoutType]: [formValues.workoutMinutes]
        }
      };
      this.workoutService.addWorkout(workout);
      
      //msg on successful addition
      this.snackBar.open('Workout added successfully!', 'Close', {
        duration: 3000, 
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.workoutForm.reset();
    }
    else{
      alert('Please fill out the form before submitting!');
    }
  }
}
