import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-key-usage-dialog',
  templateUrl: './key-usage-dialog.component.html',
  styleUrls: ['./key-usage-dialog.component.css']
})
export class KeyUsageDialogComponent implements OnInit {

  digitalSignature: boolean;
  nonRepudiation: boolean;
  keyEncipherment: boolean;
  dataEncipherment: boolean;
  keyAgreement: boolean;
  keyCertSign: boolean;
  CRLSign: boolean;
  encipherOnly: boolean;
  decipherOnly: boolean;
  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KeyUsageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit() {
    this.digitalSignature = true;
    this.nonRepudiation = true;
    this.keyEncipherment = true;
    this.dataEncipherment = true;
    this.keyAgreement = true;
    this.keyCertSign = true;
    this.CRLSign = true;
    this.encipherOnly = true;
    this.decipherOnly = true;
    this.form = new FormGroup({
      'digitalSignature': new FormControl({value: true}, null),
      'nonRepudiation': new FormControl({value: true}, null),
      'keyEncipherment': new FormControl({value: true}, null),
      'dataEncipherment': new FormControl({value: true}, null),
      'keyAgreement': new FormControl({value: true}, null),
      'keyCertSign': new FormControl({value: true}, null),
      'CRLSign': new FormControl({value: true}, null),
      'encipherOnly': new FormControl({value: true}, null),
      'decipherOnly': new FormControl({value: true}, null)    });
  }

  keyAgreementChanged() {
    if (this.keyAgreement) {
      this.encipherOnly = true;
      this.decipherOnly = true;
    }else {
      this.encipherOnly = false;
      this.decipherOnly = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

}
