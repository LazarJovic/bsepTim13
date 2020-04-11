import { Component, OnInit } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { MatDialogRef } from '@angular/material';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { SigningCertificate } from 'src/app/model/signing-certificate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-choose-certificate-dialog',
  templateUrl: './choose-certificate-dialog.component.html',
  styleUrls: ['./choose-certificate-dialog.component.css']
})
export class ChooseCertificateDialogComponent implements OnInit {

  signingCertificates: Array<SigningCertificate>;

  constructor(
    public dialogRef: MatDialogRef<ChooseCertificateDialogComponent>,
    public certificateService: CertificateService,
    public toast: ToastrService
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
        },
        error: data => {
          if (data.error && typeof data.error === "string")
          this.toast.error(data.error);
        else
          this.toast.error("Could not load signing certificates!");
        }
      }
    );
  }

}
