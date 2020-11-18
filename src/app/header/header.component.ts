import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isUserAuthenticated = false;
  private authListenerSub: Subscription;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isUserAuthenticated => {
        this.isUserAuthenticated = isUserAuthenticated;
      });
  }

  onLogout(){
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

}
