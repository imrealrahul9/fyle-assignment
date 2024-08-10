export interface Workout {
  userName: string;
  workoutTypes: string[];
  workoutMinutes: number;
  workoutTypeCount?: number; 
  workoutDurations: { [key: string]: number[] }; // Map of workout types to arrays of durations
}
