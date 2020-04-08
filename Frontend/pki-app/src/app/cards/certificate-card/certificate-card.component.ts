import { Component, OnInit, Input } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  @Input()
  item: CreateCertificate;

  constructor() { }

  ngOnInit() {
  }

  downloadCertificate() {
    
  }

}
