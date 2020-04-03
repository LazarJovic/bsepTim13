import { Component, OnInit } from '@angular/core';
import { Certificate } from 'src/app/model/certificate';

@Component({
  selector: 'certificate-overview',
  templateUrl: './certificate-overview.component.html',
  styleUrls: ['./certificate-overview.component.css']
})
export class CertificateOverviewComponent implements OnInit {

  cert1: Certificate;
  cert2: Certificate;
  cert3: Certificate;
  cert4: Certificate;
  cert5: Certificate;
  cert6: Certificate;

  lista = new Array(6);

  constructor() { 
    
  }

  ngOnInit() {
    this.cert1 = new Certificate();
    this.cert2 = new Certificate();
    this.cert3 = new Certificate();
    this.cert4 = new Certificate();
    this.cert5 = new Certificate();
    this.cert6 = new Certificate();
    this.lista = [this.cert1, this.cert2, this.cert3, this.cert4, this.cert5, this.cert6];
  }

}
