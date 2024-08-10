import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
  styleUrls: ['./workout-chart.component.css']
})
export class WorkoutChartComponent implements OnInit {
  public chart: any;
  public users: string[] = [];
  private workouts: Workout[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.workouts = workouts;
      this.users = [...new Set(workouts.map(workout => workout.userName))];
      if (this.users.length > 0) {
        // Optionally, set the default user selection
        this.onUserSelect(this.users[0]);
      }
    });
  }

  onUserSelect(userName: string): void {
    const userWorkouts = this.workouts.filter(workout => workout.userName === userName);

    const workoutTypeCounts = userWorkouts.reduce((acc, workout) => {
      for (const type in workout.workoutDurations) {
        if (workout.workoutDurations.hasOwnProperty(type)) {
          const value = workout.workoutDurations[type];
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type] += value as unknown as number;
        }
      }
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(workoutTypeCounts);
    const data = Object.values(workoutTypeCounts);
    // console.log(labels);
    // console.log(data);

    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      this.createChart(labels, data);
    }
  }

  createChart(labels: string[], data: number[]): void {
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Workout Type Duration',
          data: data,
          backgroundColor: 'green',
          barThickness: 40, 
          categoryPercentage: 0.9,
          barPercentage: 0.8 
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw} minutes`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        layout: {
          padding: 10 
        }
      }
    });
  }
  
}
