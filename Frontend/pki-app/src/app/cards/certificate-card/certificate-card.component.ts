import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Certificate } from 'src/app/model/certificate';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  // @ViewChild('pRef', {static: false}) pRef: ElementRef;

  @Input()
  item: Certificate;

  //@ViewChild('item', {static: false}) item: Certificate;

  constructor() { }

  ngOnInit() {
  }

  downloadCertificate() {
    
  }

}
