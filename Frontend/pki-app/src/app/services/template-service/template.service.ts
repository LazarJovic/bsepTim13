import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from 'src/app/model/template';
import { environment } from 'src/environments/environment';

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
}
