import { Component, OnInit } from '@angular/core';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { Router } from '@angular/router';

@Component({
  selector: 'certificate-overview',
  templateUrl: './certificate-overview.component.html',
  styleUrls: ['./certificate-overview.component.css']
})
export class CertificateOverviewComponent implements OnInit {

  constructor(private router: Router) { 
    
  }

  ngOnInit() {

  }

  back() {
    this.router.navigate(['']);
  }

}
