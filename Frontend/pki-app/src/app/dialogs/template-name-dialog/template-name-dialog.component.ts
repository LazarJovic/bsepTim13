import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-template-name-dialog',
  templateUrl: './template-name-dialog.component.html',
  styleUrls: ['./template-name-dialog.component.css']
})
export class TemplateNameDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TemplateNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl("Template", null)
    });
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ name: this.form.value.name });
  }

}
