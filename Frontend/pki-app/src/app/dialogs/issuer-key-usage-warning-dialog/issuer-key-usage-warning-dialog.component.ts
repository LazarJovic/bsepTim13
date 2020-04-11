import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-issuer-key-usage-warning-dialog',
  templateUrl: './issuer-key-usage-warning-dialog.component.html',
  styleUrls: ['./issuer-key-usage-warning-dialog.component.css']
})
export class IssuerKeyUsageWarningDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<IssuerKeyUsageWarningDialogComponent>,
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
