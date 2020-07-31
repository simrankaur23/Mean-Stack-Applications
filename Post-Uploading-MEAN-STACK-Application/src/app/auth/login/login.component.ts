import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit , OnDestroy{
  isloading = false;
  authSubStats: Subscription;
  constructor(private  authService : AuthService) { }

  ngOnInit(): void {
   this.authSubStats =  this.authService.getauthStatus().subscribe(
     authSatus => {
       this.isloading;
     }
   );
  }

  onLogin(form: NgForm){
   if(form.invalid){
     return
   }
   this.authService.login(form.value.email, form.value.password)
  }

  ngOnDestroy(){
    this.authSubStats.unsubscribe();
  }
}
