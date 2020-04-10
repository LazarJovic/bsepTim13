import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';

@Component({
  selector: 'certificate-overview',
  templateUrl: './certificate-overview.component.html',
  styleUrls: ['./certificate-overview.component.css']
})
export class CertificateOverviewComponent implements OnInit {

  endEntityCertificates: Array<OverviewCertificate>;
  signingCertificates: Array<OverviewCertificate>;
  selected: string;
  isEndEntity: boolean;

  constructor(
    private router: Router,
    public certificateService: CertificateService
  ) { }

  ngOnInit() {
    this.selected = "end-entity";
    this.isEndEntity = true;
    this.getEndEntityCertificates();
  }

  back() {
    this.router.navigate(['']);
  }

  getEndEntityCertificates() {
    this.certificateService.getEndEntityCertificatesOverview().subscribe(
      {
        next: (result) => {
          this.endEntityCertificates = result;
        },
        error: data => {
          console.log("greska");
        }
      }
    );
  }

  getSigningCertificates() {
    this.certificateService.getSigningCertificatesOverview().subscribe(
      {
        next: (result) => {
          this.signingCertificates = result;
        },
        error: data => {
          console.log("greska");
        }
      }
    );
  }

  onTypeChange() {
    this.isEndEntity = this.isEndEntity ? false : true;
    this.isEndEntity ? this.getEndEntityCertificates() : this.getSigningCertificates();
  }

}
