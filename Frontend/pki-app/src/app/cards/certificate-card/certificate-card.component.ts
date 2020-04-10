import { Component, OnInit, Input } from '@angular/core';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { CertificateService } from 'src/app/services/certificate-service/certificate.service';

@Component({
  selector: 'certificate-card',
  templateUrl: './certificate-card.component.html',
  styleUrls: ['./certificate-card.component.css']
})
export class CertificateCardComponent implements OnInit {

  @Input()
  item: OverviewCertificate;

  constructor(
    private certificateService: CertificateService
  ) { }

  ngOnInit() {
  }

  downloadCertificate() {
    this.certificateService.downloadCertificate(this.item).subscribe(
      {
        next: (data) => {
          if(data) {
            console.log("Downloaded!");
          }
        },
        error: data => {
          console.log("greska");
        }
      }
    );
  }

}
