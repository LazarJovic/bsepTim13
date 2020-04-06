import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SigningCertificate } from 'src/app/model/signing-certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(
    private http: HttpClient
  ) { }

  getSigningCertificates() {
    return this.http.get<SigningCertificate[]>(`${environment.baseUrl}/${environment.certificates}/signing-certificates`);
  }

}
