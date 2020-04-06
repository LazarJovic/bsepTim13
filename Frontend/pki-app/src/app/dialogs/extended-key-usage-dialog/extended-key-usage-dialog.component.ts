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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExtendedKeyUsageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.eku = Object.assign({}, data.extKeyUsage);
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
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({ extKeyUsage: this.eku });
  }

}
