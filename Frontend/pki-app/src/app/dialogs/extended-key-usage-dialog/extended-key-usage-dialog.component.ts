import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-extended-key-usage-dialog',
  templateUrl: './extended-key-usage-dialog.component.html',
  styleUrls: ['./extended-key-usage-dialog.component.css']
})
export class ExtendedKeyUsageDialogComponent implements OnInit {

  serverAuth: boolean;
  clientAuth: boolean;
  codeSigning: boolean;
  emailProtection: boolean;
  timeStamping: boolean;
  ocspSigning: boolean;
  ipsecEndSystem: boolean;
  ipsecTunnel: boolean;
  ipsecUser: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExtendedKeyUsageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { }

  ngOnInit() {
    this.serverAuth = true;
    this.clientAuth = true;
    this.codeSigning = true;
    this.emailProtection = true;
    this.timeStamping = true;
    this.ocspSigning = true;
    this.ipsecEndSystem = true;
    this.ipsecTunnel = true;
    this.ipsecUser = true;
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
  }

  close() {
    this.dialogRef.close();
  }

}
