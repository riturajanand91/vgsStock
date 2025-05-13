import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ApiServiceService } from '../services/api-service.service';
import { MaterialModule } from '../material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface PricingResponse {
  planTypes?: string[];
  plans?: any[];
  message?: string;
  status_code?: number;
}

interface Plan {
  id: string;
  title: string;
  description: string;
  prices: {
    weekly?: number;
    monthly?: number;
    quarterly?: number;
    halfyearly?: number;
    yearly?: number;
  };
  features: string[];
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule, FontAwesomeModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit, OnDestroy {
  public allSubscriptions: Plan[] = [];
  public allPlanTypes: string[] = [];
  public pricingForm!: FormGroup;
  faCheckCircle = faCheckCircle;
  selectedPlanType = 'monthly';
  public errorMessage: string = '';
  public isLoading: boolean = true;
  private unsubscribe$ = new Subject<void>();

  constructor(private apiService: ApiServiceService, private fb: FormBuilder) {
    this.pricingForm = this.fb.group({
      planType: ['monthly'],
      planId: [null]
    });
  }

  ngOnInit(): void {
    this.loadPricingData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadPricingData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.apiService.getPricing()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: PricingResponse) => {
          this.isLoading = false;
          if (response?.planTypes && response?.plans) {
            this.allPlanTypes = response.planTypes;
            this.allSubscriptions = response.plans.map((pkg: any) => {
              const featuresArray: string[] = [];
              for (let i = 1; i <= 10; i++) {
                const featureKey = `features${i}`;
                const featureValue = pkg.features.find((f: any) => f[featureKey])?.[featureKey];
                if (featureValue) {
                  featuresArray.push(featureValue);
                }
              }
              return {
                id: pkg.package_code_str,
                title: pkg.package_name,
                description: pkg.description,
                prices: pkg.prices,
                features: featuresArray,
              };
            });
            console.log('API Data:', response);
            console.log('allSubscriptions:', this.allSubscriptions);
            console.log('allPlanTypes:', this.allPlanTypes);
          } else {
            this.errorMessage = 'Failed to load pricing data. Invalid response.';
            console.error('Invalid pricing data response:', response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load pricing data. Please try again later.';
          console.error('Error loading pricing data:', error);
        }
      });
  }

  getDisplayedPrice(prices: Plan['prices']): number | undefined {
    return prices?.[this.selectedPlanType as keyof Plan['prices']];
  }

  selectPlanType(type: string): void {
    this.selectedPlanType = type;
  }

  navigateToCheckout(planId: string, type: string): void {
    window.open(`https://master.d31si37xvdkk0g.amplifyapp.com/checkout?planId=${planId}&type=${type}`, '_blank');
  }
}