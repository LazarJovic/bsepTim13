import { Component, OnInit, Input } from '@angular/core';
import { Certificate } from 'src/app/model/certificate';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  @Input()
  item: Certificate;

  constructor() { }

  ngOnInit() {
  }

  downloadCertificate() {
    
  }

}
