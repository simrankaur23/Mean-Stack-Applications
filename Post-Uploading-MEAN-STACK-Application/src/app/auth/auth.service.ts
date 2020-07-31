import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticate = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatus = new Subject<boolean>();
  constructor(private http:HttpClient, private router:Router ){}
  


  createUser(email: string,  password:string){
    const authData: Auth = {email: email,password: password};
   
     this.http.post(BACKEND_URL + "/signup",  authData)
     .subscribe(() => {
       this.router.navigate(["/"])
     }, error => {
       this.authStatus.next(false)
     })
  }

  getauthStatus(){
    return this.authStatus.asObservable();
  }

  getisAuth(){
    return this.isAuthenticate;
  }

  getuserID(){
    return this.userId;
  }

  login(email: string,password:string){
    const authData: Auth = {email: email,password: password};
    this.http.post<{token:string, expiresIn: number, userId: string}>(BACKEND_URL + "/login",  authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticate = true;
        this.userId = response.userId;
        this.authStatus.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        this.saveAuthdata(token, expirationDate, this.userId);
        this.router.navigate(['/'])
      }
     }, error => {
       alert("Invalid user")
       this.authStatus.next(false);
     })
  }

  logout(){
    this.token = null;  
    this.isAuthenticate = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/'])
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticate = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn  / 1000)
      this.authStatus.next(true)
    }
  }
    
  getToken(){
    return this.token;
  }

  private saveAuthdata(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration',expirationDate.toISOString())
    localStorage.setItem('userId', userId);

  }

  private setAuthTimer(duration: number){
    console.log("setting timer:-" + duration); 
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId")
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
