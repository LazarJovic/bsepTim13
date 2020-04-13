import { Component, OnInit, Input } from '@angular/core';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { RevokeWarningDialogComponent } from 'src/app/dialogs/revoke-warning-dialog/revoke-warning-dialog.component';
import { CertificateStatusDialogComponent } from 'src/app/dialogs/certificate-status-dialog/certificate-status-dialog.component';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  @Input()
  item: OverviewCertificate;

  constructor(
    private certificateService: CertificateService,
    private toastr: ToastrService,
    private warningDialog: MatDialog,
    private statusDialog: MatDialog
  ) { }

  ngOnInit() {
  }

  downloadCertificate() {
    this.certificateService.downloadCertificate(this.item).subscribe(
      {
        next: (data) => {
          if(data) {
            this.toastr.success("Downloaded into your Downloads folder!");
          }
        },
        error: data => {
          this.toastr.error("Certificate download failed!");
        }
      }
    );
  }

  openRevokeWarning() {
    const dialogRef = this.warningDialog.open(RevokeWarningDialogComponent, {
      maxWidth: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.revokeCertificate();
      }
    });
  }

  revokeCertificate() {
    this.certificateService.revokeCertificate(this.item).subscribe(
      {
        next: (data) => {
          if(data) {
            this.toastr.success("Certificate successfully revoked.");
          }
        },
        error: data => {
          if (data.error && typeof data.error === "string")
            this.toastr.error(data.error);
          else
            this.toastr.error("Certificate revocation failed!");
        }
      }
    );
  }

  checkStatus() {
    const dialogRef = this.statusDialog.open(CertificateStatusDialogComponent, {
      width: '300px',
      data: { 
        alias: this.item.serialNum + this.item.subjectEmail + this.item.issuerEmail 
      }
    });
  }

}
3