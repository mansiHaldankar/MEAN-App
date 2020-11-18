import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( private authService: AuthService){}

  title = 'blogApplication';
  /*storedPosts = [];
  // tslint:disable-next-line: typedef
  onPostAdded(post: Post[]){
    this.storedPosts.push(post);
  }*/
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
