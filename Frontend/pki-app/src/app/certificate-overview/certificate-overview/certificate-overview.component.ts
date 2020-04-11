import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { ToastrService } from 'ngx-toastr';

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
    private certificateService: CertificateService,
    private toast: ToastrService
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
          if (data.error && typeof data.error === "string")
            this.toast.error(data.error);
          else
            this.toast.error("Could not load end-entity certificates.");
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
          if (data.error && typeof data.error === "string")
            this.toast.error(data.error);
          else
            this.toast.error("Could not load signing certificates.");
        }
      }
    );
  }

  onTypeChange() {
    this.isEndEntity = this.isEndEntity ? false : true;
    this.isEndEntity ? this.getEndEntityCertificates() : this.getSigningCertificates();
  }

}
