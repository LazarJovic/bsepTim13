import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { CreateCertificateComponent } from './create-forms/create-certificate/create-certificate.component';
import { CertificateOverviewComponent } from './certificate-overview/certificate-overview/certificate-overview.component';


const routes: Routes = [
  { 
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
},
{
  path: 'dashboard',
  component: DashboardComponent
},
{
  path: 'create-certificate',
  component: CreateCertificateComponent
}
,
{
  path: 'certificate-overview',
  component: CertificateOverviewComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
