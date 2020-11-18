import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  isLoading = false;
  private authListenerSub: Subscription;

  ngOnInit(): void {
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onLogin(form: NgForm){
    console.log(form.value);
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authListenerSub.unsubscribe();
  }
}
