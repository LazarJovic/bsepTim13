import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SigningCertificate } from 'src/app/model/signing-certificate';
import { CreateCertificate } from 'src/app/model/create-certificate';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';

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

  createCertificate(data: CreateCertificate) : Observable<CreateCertificate> {
    return this.http.post<CreateCertificate>(`${environment.baseUrl}/${environment.certificates}`, data);
  }

}
