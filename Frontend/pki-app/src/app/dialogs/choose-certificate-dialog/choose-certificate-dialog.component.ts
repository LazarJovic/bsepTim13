import { Component, OnInit } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { MatDialogRef } from '@angular/material';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { SigningCertificate } from 'src/app/model/signing-certificate';

@Component({
  selector: 'app-choose-certificate-dialog',
  templateUrl: './choose-certificate-dialog.component.html',
  styleUrls: ['./choose-certificate-dialog.component.css']
})
export class ChooseCertificateDialogComponent implements OnInit {

  signingCertificates: Array<SigningCertificate>;

  constructor(
    public dialogRef: MatDialogRef<ChooseCertificateDialogComponent>,
    public certificateService: CertificateService
  ) { }

  ngOnInit() {
    this.getSigningCertificates();
  }

  onSubmit(certificate) {
    this.dialogRef.close({ certificate });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSigningCertificates() {
    this.certificateService.getSigningCertificates().subscribe(
      {
        next: (result) => {
          this.signingCertificates = result;
          console.log(this.signingCertificates);
        },
        error: data => {
          console.log("greska");
        }
      }
    );
  }

}
