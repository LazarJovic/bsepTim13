import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExtKeyUsage } from 'src/app/model/ext-key-usage';

@Component({
  selector: 'app-extended-key-usage-dialog',
  templateUrl: './extended-key-usage-dialog.component.html',
  styleUrls: ['./extended-key-usage-dialog.component.css']
})
export class ExtendedKeyUsageDialogComponent implements OnInit {

  eku: ExtKeyUsage;
  form: FormGroup;
  issuerExtKeyUsage: string[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExtendedKeyUsageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.eku = Object.assign({}, data.extKeyUsage);
    if (data.issuerExtKeyUsage) {
      this.issuerExtKeyUsage = Object.assign({}, data.issuerExtKeyUsage);
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      'serverAuth': new FormControl({value: true}, null),
      'clientAuth': new FormControl({value: true}, null),
      'codeSigning': new FormControl({value: true}, null),
      'emailProtection': new FormControl({value: true}, null),
      'timeStamping': new FormControl({value: true}, null),
      'ocspSigning': new FormControl({value: true}, null),
      'ipsecEndSystem': new FormControl({value: true}, null),
      'ipsecTunnel': new FormControl({value: true}, null),
      'ipsecUser': new FormControl({value: true}, null)    
    });
    this.adjustToIssuer();
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ extKeyUsage: this.eku });
  }

  adjustToIssuer() {
    let issuerKeyUsageTemp = new ExtKeyUsage(true, true, true, true, true, true, true, true, true);
    issuerKeyUsageTemp.fromStringArray(this.issuerExtKeyUsage);
    if (!issuerKeyUsageTemp.serverAuth) {
      this.eku.serverAuth = false;
      this.form.controls['serverAuth'].disable();
    }
    if (!issuerKeyUsageTemp.clientAuth) {
      this.eku.clientAuth = false;
      this.form.controls['clientAuth'].disable();
    }
    if (!issuerKeyUsageTemp.codeSigning) {
      this.eku.codeSigning = false;
      this.form.controls['codeSigning'].disable();
    }
    if (!issuerKeyUsageTemp.emailProtection) {
      this.eku.emailProtection = false;
      this.form.controls['emailProtection'].disable();
    }
    if (!issuerKeyUsageTemp.timeStamping) {
      this.eku.timeStamping = false;
      this.form.controls['timeStamping'].disable();
    }
    if (!issuerKeyUsageTemp.ocspSigning) {
      this.eku.ocspSigning = false;
      this.form.controls['ocspSigning'].disable();
    }
    if (!issuerKeyUsageTemp.ipsecEndSystem) {
      this.eku.ipsecEndSystem = false;
      this.form.controls['ipsecEndSystem'].disable();
    }
    if (!issuerKeyUsageTemp.ipsecTunnel) {
      this.eku.ipsecTunnel = false;
      this.form.controls['ipsecTunnel'].disable();
    }
    if (!issuerKeyUsageTemp.ipsecUser) {
      this.eku.ipsecUser = false;
      this.form.controls['ipsecUser'].disable();
    }
  }

}
