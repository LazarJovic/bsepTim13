import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { CertificateStatus } from 'src/app/model/certificate-status';

export interface DialogData {
  alias: string;
}

@Component({
  selector: 'app-certificate-status-dialog',
  templateUrl: './certificate-status-dialog.component.html',
  styleUrls: ['./certificate-status-dialog.component.css']
})
export class CertificateStatusDialogComponent implements OnInit {

  status: CertificateStatus;

  constructor(
    private certSrevice: CertificateService,
    private dialogRef: MatDialogRef<CertificateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.checkStatus();
  }

  checkStatus() {
    this.certSrevice.checkStatus(this.data.alias).subscribe(
      {
        next: (result) => {
          if(result) {
            this.status = result;
          }
        }
      }
    );
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ result: true });
  }

}
