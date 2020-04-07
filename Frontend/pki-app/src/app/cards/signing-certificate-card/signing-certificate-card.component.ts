import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { SigningCertificate } from 'src/app/model/signing-certificate';

@Component({
  selector: 'signing-certificate-card',
  templateUrl: './signing-certificate-card.component.html',
  styleUrls: ['./signing-certificate-card.component.css']
})
export class SigningCertificateCardComponent implements OnInit {

  @Input()
  item: SigningCertificate;

  @Output() certificateChosen = new EventEmitter();

  keyUsages: string;

  constructor() { }

  ngOnInit() {
    this.updateKeyUsage();

  }

  chooseCertificate() {
    this.certificateChosen.emit(this.item);
  }

  updateKeyUsage() {
    this.keyUsages = "";
    var i = 0;
    for(; i < this.item.keyUsage.length; i++) {
      this.keyUsages += this.item.keyUsage[i] + ", ";
    }
    this.keyUsages = this.keyUsages.substr(0, this.keyUsages.length - 2);
  }



}
