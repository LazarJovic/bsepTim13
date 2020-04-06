import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/model/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  createSubject(data: User) : Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/${environment.users}`, data);
  }

  getUsers() : Observable<User[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/${environment.users}`);
  }

}
