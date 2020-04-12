import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  isValid: boolean;
  isRevoked: boolean;
}

@Component({
  selector: 'app-certificate-status-dialog',
  templateUrl: './certificate-status-dialog.component.html',
  styleUrls: ['./certificate-status-dialog.component.css']
})
export class CertificateStatusDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CertificateStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ result: true });
  }

}
