import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { User } from 'src/app/model/user';
import { DialogCreateSubjectComponent } from '../dialog-create-subject/dialog-create-subject.component';

@Component({
  selector: 'create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  createCertificateForm: FormGroup;

  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createCertificateForm = new FormGroup({
      'issuer': new FormControl(null, [Validators.required]),
      'serialNumber': new FormControl(null, [Validators.required]),
      'startDate': new FormControl({value: null}, [Validators.required]),
      'endDate': new FormControl({value: null}, [Validators.required]),
      'subject': new FormControl({value: null}, [Validators.required]),
      'signatureAlgorithm': new FormControl({value: null}, [Validators.required]),
      'pubKeyAlgorithm': new FormControl({value: null}, [Validators.required])
    });

  }

  chooseCert() {

  }

  createCertificate() {

  }

  openSubjectDialog() {
    const dialogRef = this.dialog.open(DialogCreateSubjectComponent, {
      width: '40vw',  
      height: '70vh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      var subject = new User(result.givenName, result.lastName, result.commonName, result.country, result.organization,
        result.organizationalUnit, result.locality, result.email);
      
        console.log(subject);
    });
  }

  back() {
    this.router.navigate(['']);
  }

}



