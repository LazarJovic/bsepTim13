import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-dialog-create-subject',
  templateUrl: './dialog-create-subject.component.html',
  styleUrls: ['./dialog-create-subject.component.css']
})
export class DialogCreateSubjectComponent implements OnInit {

  createSubjectForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User) {}

  ngOnInit(): void {
    this.createSubjectForm = new FormGroup({
      'givenName': new FormControl(null, [Validators.maxLength(50)]),
      'lastName': new FormControl(null, [Validators.maxLength(50)]),
      'country': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'locality': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'organization': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'orgUnit': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'commonName': new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      'email': new FormControl(null, [Validators.required, Validators.email])
    });

  }
  
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
