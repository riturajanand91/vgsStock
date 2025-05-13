import { Routes } from '@angular/router';
import { ComplianceComponent } from './compliance/compliance.component';
import { PricingComponent } from './pricing/pricing.component';

export const routes: Routes = [
  { path: '', component: ComplianceComponent },
  { path: 'pricing', component: PricingComponent }
];

