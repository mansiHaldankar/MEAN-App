import { Component } from '@angular/core';

import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blogApplication';
  /*storedPosts = [];
  // tslint:disable-next-line: typedef
  onPostAdded(post: Post[]){
    this.storedPosts.push(post);
  }*/
}
