import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.SERVER_URL;
  constructor(private readonly http: HttpClient) { }

  getSingleUser(mand: number): Observable<UserResponse>{
    return this.http.get<UserResponse>(this.url + 'users/' + mand).pipe(map((res:any) => {return res}));
  }
}
