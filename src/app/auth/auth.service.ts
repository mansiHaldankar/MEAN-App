import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { environment } from './../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isAuthenticate = false;
  private token: string;
  private tokenTimer: any;
  private userID: string;
  private authStatusListener = new Subject<boolean>();

  constructor( private http: HttpClient, private router: Router ) { }

  getToken(){
      return this.token;
  }

  isUserAuth(){
    return this.isAuthenticate;
  }

  getUserId(){
    return this.userID;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData =  {
      email: email,
      password: password
    }
    this.http.post(BACKEND_URL + 'signup', authData)
    .subscribe(result => {
      this.router.navigate(["/"]);
    }, error => {
        console.log(error);
        this.authStatusListener.next(false);
    });
  }

  loginUser( email: string, password: string ){
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{ token: string, expiresIn: number, userID: string }>(BACKEND_URL + 'login', authData)
    .subscribe(result => {
      console.log(result);
      this.token = result.token;
      if (this.token){
        const expiresInDuration = result.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticate = true;
        this.authStatusListener.next(true);
        this.userID = result.userID;
        const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userID);

        this.router.navigate(["/"]);
      }

    }, error => {
      console.log(error);
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    const now = new Date();
    if(authInformation && authInformation.expirationDate){
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0){
        this.token = authInformation.token;
        this.isAuthenticate = true;
        this.userID = authInformation.userID;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  logoutUser(){
    this.token = null;
    this.isAuthenticate = false;
    this.authStatusListener.next(false);
    this.userID = null;
    clearTimeout(this.tokenTimer);
    this.deleteAuthData();
    this.router.navigate(["/"]);

  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private saveAuthData( token: string, expirationDate: Date, userID: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userID', userID);
  }

  private deleteAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userID');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userID = localStorage.getItem('userID');

    if(!token || !expirationDate || !userID){
      return;
    }

    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userID: userID
    }
  }
}
