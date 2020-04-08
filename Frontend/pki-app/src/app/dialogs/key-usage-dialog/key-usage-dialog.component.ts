import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { KeyUsage } from 'src/app/model/key-usage';

@Component({
  selector: 'app-key-usage-dialog',
  templateUrl: './key-usage-dialog.component.html',
  styleUrls: ['./key-usage-dialog.component.css']
})

export class KeyUsageDialogComponent implements OnInit {

  ku: KeyUsage;
  form: FormGroup;
  encipherOnlyDisabled: boolean;
  decipherOnlyDisabled: boolean;
  issuerKeyUsage: string[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KeyUsageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
    this.ku = Object.assign({}, data.keyUsage);
    if (data.issuerKeyUsage)
      this.issuerKeyUsage = Object.assign({}, data.issuerKeyUsage);
  }

  ngOnInit() {
    this.form = new FormGroup({
      'digitalSignature': new FormControl({value: true}, null),
      'nonRepudiation': new FormControl({value: true}, null),
      'keyEncipherment': new FormControl({value: true}, null),
      'dataEncipherment': new FormControl({value: true}, null),
      'keyAgreement': new FormControl({value: true}, null),
      'keyCertSign': new FormControl({value: true}, null),
      'CRLSign': new FormControl({value: true}, null),
      'encipherOnly': new FormControl({value: true}, null),
      'decipherOnly': new FormControl({value: true}, null)    
    });
    //this.keyAgreementChanged();
    if (this.issuerKeyUsage)
      this.adjustToIssuer();
  }

  keyAgreementChanged() {
    if (this.ku.keyAgreement) {
      this.ku.encipherOnly = true;
      this.ku.decipherOnly = true;
      this.form.controls['encipherOnly'].enable();
      this.form.controls['decipherOnly'].enable();
    }else {
      this.ku.encipherOnly = false;
      this.ku.decipherOnly = false;
      this.form.controls['encipherOnly'].disable();
      this.form.controls['decipherOnly'].disable();
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ keyUsage: this.ku });
  }

  adjustToIssuer() {
    let issuerKeyUsageTemp = new KeyUsage(true, true, true, true, true, true, true, true, true);
    issuerKeyUsageTemp.fromStringArray(this.issuerKeyUsage);
    if (!issuerKeyUsageTemp.digitalSignature) {
      this.ku.digitalSignature = false;
      this.form.controls['digitalSignature'].disable();
    }
    if (!issuerKeyUsageTemp.nonRepudiation) {
      this.ku.nonRepudiation = false;
      this.form.controls['nonRepudiation'].disable();
    }
    if (!issuerKeyUsageTemp.keyEncipherment) {
      this.ku.keyEncipherment = false;
      this.form.controls['keyEncipherment'].disable();
    }
    if (!issuerKeyUsageTemp.dataEncipherment) {
      this.ku.dataEncipherment = false;
      this.form.controls['dataEncipherment'].disable();
    }
    if (!issuerKeyUsageTemp.keyAgreement) {
      this.ku.keyAgreement = false;
      this.form.controls['keyAgreement'].disable();
    }
    if (!issuerKeyUsageTemp.keyCertSign) {
      this.ku.keyCertSign = false;
      this.form.controls['keyCertSign'].disable();
    }
    if (!issuerKeyUsageTemp.CRLSign) {
      this.ku.CRLSign = false;
      this.form.controls['CRLSign'].disable();
    }
    if (!issuerKeyUsageTemp.encipherOnly) {
      this.ku.encipherOnly = false;
      this.form.controls['encipherOnly'].disable();
    }
    if (!issuerKeyUsageTemp.decipherOnly) {
      this.ku.decipherOnly = false;
      this.form.controls['decipherOnly'].disable();
    }
  }

}
