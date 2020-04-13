import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-template-warning-dialog',
  templateUrl: './template-warning-dialog.component.html',
  styleUrls: ['./template-warning-dialog.component.css']
})
export class TemplateWarningDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TemplateWarningDialogComponent>,
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
