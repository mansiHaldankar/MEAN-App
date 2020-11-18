import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  private authListenerSub: Subscription;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
      this.authListenerSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
        this.isLoading = false;
      });
  }
  onSubmit(form: NgForm){
    if (form.invalid){
      return;
    }

    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authListenerSub.unsubscribe();
  }
}
