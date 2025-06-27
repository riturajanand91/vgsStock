import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../material.module';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../services/api.service';
import { MatTableDataSource } from '@angular/material/table';

interface ComplianceResponse {
  message?: string;
  status_code?: number;
  escalation_matrix?: EscalationMatrix[];
  scores?: Score[];
}

interface EscalationMatrix {
  id: number;
  matrix_date: string;
  designation: string;
  contact_Person: string;
  address: string;
  email: string;
  phone: string;
  working_hours: string;
  created_at: string;
  updated_at: string;
  user_subscription: number;
  created_by: number;
  updated_by: number;
}

interface Score {
  id: number;
  scores_data: string;
  seq_no: number | null;
  received_from: string;
  pending_at_the_end_of_last_month: number;
  received: number;
  resolved: number;
  total_pending: number;
  pending_Complaints_gte_3_months: number;
  average_resolution_time: number;
  created_at: string;
  updated_at: string;
  user_subscription: number;
  created_by: number;
  updated_by: number;
}

@Component({
    selector: 'app-compliance',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './compliance.component.html',
    styleUrl: './compliance.component.scss'
})
export class ComplianceComponent implements OnInit, OnDestroy {
  public errorMessage: string = '';
  public isLoading: boolean = true;
  private unsubscribe$ = new Subject<void>();

  displayedEscalationColumns: string[] = ['designation', 'contactPerson', 'address', 'contactNo', 'email', 'workingHours'];
  escalationDataSource: MatTableDataSource<EscalationMatrix> = new MatTableDataSource<EscalationMatrix>([]);

  displayedScoresColumns: string[] = ['received_from', 'pending_at_the_end_of_last_month', 'received', 'resolved', 'total_pending', 'pending_Complaints_gte_3_months', 'average_resolution_time'];
  scoresDataSource: MatTableDataSource<Score> = new MatTableDataSource<Score>([]);

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadComplianceData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadComplianceData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getCompliance()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: ComplianceResponse) => {
          this.isLoading = false;
          if (response) {
            console.log('API Data:', response);
            if (response.escalation_matrix) {
              this.escalationDataSource.data = response.escalation_matrix;
            } else {
              console.warn('Escalation matrix data not found in the response.');
            }
            if (response.scores) {
              this.scoresDataSource.data = response.scores;
            } else {
              console.warn('Scores data not found in the response.');
            }
          } else {
            this.errorMessage = 'Failed to load Compliance data. Invalid response.';
            console.error('Invalid Compliance data response:', response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load Compliance data. Please try again later.';
          console.error('Error loading Compliance data:', error);
        }
      });
  }
}