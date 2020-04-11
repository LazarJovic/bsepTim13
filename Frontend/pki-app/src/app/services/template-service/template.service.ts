import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from 'src/app/model/template';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(
    private http: HttpClient
  ) { }

  saveTemplate(template: Template) {
    return this.http.post<Template>(`${environment.baseUrl}/${environment.templates}`, template);
  }

  getTemplates() {
    return this.http.get<Template[]>(`${environment.baseUrl}/${environment.templates}`);
  }
}
