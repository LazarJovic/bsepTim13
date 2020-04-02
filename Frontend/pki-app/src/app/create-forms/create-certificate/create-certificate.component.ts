import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'create-certificate',
  templateUrl: './create-certificate.component.html',
  styleUrls: ['./create-certificate.component.css']
})
export class CreateCertificateComponent implements OnInit {

  createCertificateForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createCertificateForm = new FormGroup({
      'signingCertificates': new FormControl(null)
    });
  }

}
