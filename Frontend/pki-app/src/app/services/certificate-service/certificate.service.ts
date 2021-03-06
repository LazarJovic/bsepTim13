import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SigningCertificate } from 'src/app/model/signing-certificate';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { Observable } from 'rxjs';
import { OverviewCertificate } from 'src/app/model/overview-certificate';
import { RevokedCertificate } from 'src/app/model/revoked-certificare';
import { CertificateStatus } from 'src/app/model/certificate-status';

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

  getSigningCertificatesOverview() {
    return this.http.get<OverviewCertificate[]>(`${environment.baseUrl}/${environment.certificates}/signing-certificates-overview`);
  }

  getEndEntityCertificatesOverview() {
    return this.http.get<OverviewCertificate[]>(`${environment.baseUrl}/${environment.certificates}/end-entity-certificates-overview`);
  }

  createCertificate(data: CreateCertificate) : Observable<CreateCertificate> {
    return this.http.post<CreateCertificate>(`${environment.baseUrl}/${environment.certificates}`, data);
  }

  downloadCertificate(data: OverviewCertificate) : Observable<OverviewCertificate> {
    return this.http.post<OverviewCertificate>(`${environment.baseUrl}/${environment.certificates}/download`, data);
  }

  revokeCertificate(data: OverviewCertificate) {
    
    // var  headers = new HttpHeaders();
    // headers.append("Hash-Algorithm", data.hashAlgorithm);
    // headers.append("Issuer-Name-Hash", data.issuerNameHash);
    // headers.append("Issuer-Key-Hash", data.issuerKeyHash);
    // headers.append("Serial-Number", data.serialNum);
    
    return this.http.post<RevokedCertificate>(`${environment.baseUrl}/${environment.revokedCertificates}`, 
    data);
  }

  checkStatus(alias: string) {
    return this.http.put<CertificateStatus>(`${environment.baseUrl}/${environment.certificates}`, alias);
  }

}
