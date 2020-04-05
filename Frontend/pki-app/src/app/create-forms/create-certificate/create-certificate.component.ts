import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { KeyUsageDialogComponent } from 'src/app/dialogs/key-usage-dialog/key-usage-dialog.component';

@Component({
  selector: 'create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  createCertificateForm: FormGroup;
  keyUsageChecked: boolean;
  extendedKeyUsageChecked: boolean;

  constructor(
    private router: Router,
    private keyUsageDialog: MatDialog,
    private extendedKeyUsageDialog: MatDialog
  ) { }

  ngOnInit() {
    this.createCertificateForm = new FormGroup({
      'issuer': new FormControl(null, [Validators.required]),
      'serialNumber': new FormControl(null, [Validators.required]),
      'startDate': new FormControl({value: null}, [Validators.required]),
      'endDate': new FormControl({value: null}, [Validators.required]),
      'subject': new FormControl({value: null}, [Validators.required]),
      'signatureAlgorithm': new FormControl({value: null}, [Validators.required]),
      'pubKeyAlgorithm': new FormControl({value: null}, [Validators.required]),
      //'test': new FormControl({value: null}, null)
    });
  }

  chooseCert() {

  }

  createSubject() {

  }

  createCertificate() {
    
  }

  back() {
    this.router.navigate(['']);
  }

  keyUsageOpen() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "30vw";

    dialogConfig.data = {
      //patient: this.patient
    };
    this.keyUsageDialog.open(KeyUsageDialogComponent, dialogConfig);
  }

}
