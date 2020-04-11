import { Component, OnInit, Input } from '@angular/core';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  @Input()
  item: OverviewCertificate;

  constructor(
    private certificateService: CertificateService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  downloadCertificate() {
    this.certificateService.downloadCertificate(this.item).subscribe(
      {
        next: (data) => {
          if(data) {
            this.toastr.success("Downloaded into your Downloads folder!");
          }
        },
        error: data => {
          this.toastr.error("Certificate download failed!");
        }
      }
    );
  }

  revokeCertificate() {
    this.certificateService.revokeCertificate(this.item).subscribe(
      {
        next: (data) => {
          if(data) {
            this.toastr.success("Certificate successfully revoked.");
          }
        },
        error: data => {
          this.toastr.error("Certificate revocation failed!");
        }
      }
    );
  }

}
