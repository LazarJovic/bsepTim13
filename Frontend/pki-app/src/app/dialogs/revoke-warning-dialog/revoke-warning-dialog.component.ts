import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-revoke-warning-dialog',
  templateUrl: './revoke-warning-dialog.component.html',
  styleUrls: ['./revoke-warning-dialog.component.css']
})
export class RevokeWarningDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RevokeWarningDialogComponent>,
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
