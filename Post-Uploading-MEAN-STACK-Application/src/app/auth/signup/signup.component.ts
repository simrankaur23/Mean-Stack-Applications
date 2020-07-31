import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {
  isloading = false;
   authSubStats: Subscription;
  constructor(private  authService : AuthService) { }

  ngOnInit(): void {
   this.authSubStats =  this.authService.getauthStatus().subscribe(
     authSatus => {
       
     }
   );
  }

  onSignup(form: NgForm){
  
    if(form.invalid){
      return
    }
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(){
    this.authSubStats.unsubscribe();
    }
}
