import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { WorkoutService } from '../workout.service';
import { Workout } from '../workout.model';

@Component({
  selector: 'app-workout-chart',
  templateUrl: './workout-chart.component.html',
  styleUrls: ['./workout-chart.component.css']
})
export class WorkoutChartComponent implements OnInit, AfterViewInit {
  users: string[] = [];
  selectedUser: string | null = null;
  private workouts: Workout[] = [];
  private chart: Chart | undefined;

  constructor(private workoutService: WorkoutService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe(workouts => {
      this.workouts = workouts;
      this.users = [...new Set(workouts.map(workout => workout.userName))];
    });
  }

  ngAfterViewInit(): void {
    // Ensure the chart initializes only after the view is initialized
    this.initializeChart();
  }

  initializeChart(): void {
    this.chart = new Chart('workoutChart', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Workout Duration',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
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
        }
      }
    });
  }

  onUserSelect(userName: string): void {
    console.log('User selected:', userName);
    this.selectedUser = userName;
    const userWorkouts = this.workouts.filter(workout => workout.userName === userName);
  
    console.log('User workouts:', userWorkouts);
  
    if (!this.chart) {
      console.error('Chart is not initialized.');
      return;
    }
  
    const workoutTypeCounts = userWorkouts.reduce((acc, workout) => {
      workout.workoutTypes.forEach(type => {
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += workout.workoutMinutes;
      });
      return acc;
    }, {} as { [key: string]: number });
  
    console.log('Workout type counts:', workoutTypeCounts);
  
    const labels = Object.keys(workoutTypeCounts);
    const data = Object.values(workoutTypeCounts);
  
    console.log('Chart data:', { labels, data });
  
    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;
    this.chart.update();
  }
  
}
