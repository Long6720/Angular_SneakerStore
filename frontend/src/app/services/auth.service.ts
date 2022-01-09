import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserResponse } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.SERVER_URL;
  userData$ = new BehaviorSubject<any>(null);
  loginMessage$ = new BehaviorSubject<any>(null);
  userRole!: string;
  
  
  constructor(private readonly http: HttpClient,
              private readonly router: Router) {};

    loginUser(email: string, matkhau: string){
      return this.http.post<UserResponse>(`${this.url}auth/login`, {email, matkhau})
      .pipe(
        map((user: UserResponse)=>{
          if(typeof (user) === 'string'){
            this.loginMessage$.next(user);
          }
          else {
            this.userRole = user.role;
            this.userData$.next(user);
          }
        }),
        catchError((err: HttpErrorResponse) => of(err.error.message))
      );
    }

    public get currentUserValue(): UserResponse {
      return this.userData$.value;
    }
    
    registerUser(user: UserResponse): Observable<UserResponse>{
      return this.http.post<UserResponse>(`${this.url}auth/register`, user);
    }

    logoutUser(){
      this.userData$.next(null);
      this.router.navigate(['/']).then();
    }

}

