import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { CreateCertificateComponent } from './create-forms/create-certificate/create-certificate.component';
import { CertificateOverviewComponent } from './certificate-overview/certificate-overview/certificate-overview.component';
import { MaterialModule } from './material-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CertificateCardComponent } from './cards/certificate-card/certificate-card.component';
import { DialogCreateSubjectComponent } from './create-forms/dialog-create-subject/dialog-create-subject.component';
import { HttpClientModule } from '@angular/common/http';
import { KeyUsageDialogComponent } from './dialogs/key-usage-dialog/key-usage-dialog.component';
import { ExtendedKeyUsageDialogComponent } from './dialogs/extended-key-usage-dialog/extended-key-usage-dialog.component';
import { ChooseCertificateDialogComponent } from './dialogs/choose-certificate-dialog/choose-certificate-dialog.component';
import { SigningCertificateCardComponent } from './cards/signing-certificate-card/signing-certificate-card.component';
import { TemplateNameDialogComponent } from './dialogs/template-name-dialog/template-name-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { TemplateCardComponent } from './cards/template-card/template-card.component';
import { LoadTemplateDialogComponent } from './dialogs/load-template-dialog/load-template-dialog.component';
import { IssuerKeyUsageWarningDialogComponent } from './dialogs/issuer-key-usage-warning-dialog/issuer-key-usage-warning-dialog.component';
import { RevokeWarningDialogComponent } from './dialogs/revoke-warning-dialog/revoke-warning-dialog.component';
import { CertificateStatusDialogComponent } from './dialogs/certificate-status-dialog/certificate-status-dialog.component';
import { TemplateWarningDialogComponent } from './dialogs/template-warning-dialog/template-warning-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateCertificateComponent,
    CertificateOverviewComponent,
    CertificateCardComponent,
    DialogCreateSubjectComponent,
    KeyUsageDialogComponent,
    ExtendedKeyUsageDialogComponent,
    ChooseCertificateDialogComponent,
    SigningCertificateCardComponent,
    TemplateNameDialogComponent,
    TemplateCardComponent,
    LoadTemplateDialogComponent,
    IssuerKeyUsageWarningDialogComponent,
    RevokeWarningDialogComponent,
    CertificateStatusDialogComponent,
    TemplateWarningDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    HttpClientModule,
    MatCheckboxModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogCreateSubjectComponent,
    KeyUsageDialogComponent,
    ExtendedKeyUsageDialogComponent,
    ChooseCertificateDialogComponent,
    TemplateNameDialogComponent,
    LoadTemplateDialogComponent,
    IssuerKeyUsageWarningDialogComponent,
    RevokeWarningDialogComponent,
    CertificateStatusDialogComponent,
    TemplateWarningDialogComponent
  ]
})
export class AppModule { }
