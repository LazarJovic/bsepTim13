import { Component, OnInit, Input } from '@angular/core';
import { Certificate } from 'src/app/model/certificate';

@Component({
  selector: 'signing-certificate-card',
  templateUrl: './signing-certificate-card.component.html',
  styleUrls: ['./signing-certificate-card.component.css']
})
export class SigningCertificateCardComponent implements OnInit {

  @Input()
  item: Certificate;

  constructor() { }

  ngOnInit() {
  }

  chooseCertificate() {

  }

}
