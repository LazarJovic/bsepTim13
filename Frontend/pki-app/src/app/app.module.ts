import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { CreateCertificateComponent } from './create-forms/create-certificate/create-certificate.component';
import { CreateSubjectComponent } from './create-forms/create-subject/create-subject.component';
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
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateCertificateComponent,
    CreateSubjectComponent,
    CertificateOverviewComponent,
    CertificateCardComponent,
    DialogCreateSubjectComponent,
    KeyUsageDialogComponent,
    ExtendedKeyUsageDialogComponent,
    ChooseCertificateDialogComponent,
    SigningCertificateCardComponent
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
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogCreateSubjectComponent,
    KeyUsageDialogComponent,
    ExtendedKeyUsageDialogComponent,
    ChooseCertificateDialogComponent
  ]
})
export class AppModule { }
