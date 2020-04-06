import { Component, OnInit } from '@angular/core';
import { Certificate } from 'src/app/model/certificate';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-choose-certificate-dialog',
  templateUrl: './choose-certificate-dialog.component.html',
  styleUrls: ['./choose-certificate-dialog.component.css']
})
export class ChooseCertificateDialogComponent implements OnInit {

  cert1: Certificate;

  lista = new Array(4);

  constructor(
    public dialogRef: MatDialogRef<ChooseCertificateDialogComponent>
  ) { }

  ngOnInit() {
    this.cert1 = new Certificate();

    this.lista = [this.cert1, this.cert1, this.cert1, this.cert1];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
