import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public postsService: PostsService) { }

  // @Output() postCreated = new EventEmitter <Post> ();

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  onAddPost(Form: NgForm){
    if(Form.invalid){
      return true;
    }
    // const post: Post = {
    //   title : Form.value.title,
    //   content : Form.value.content
    // };
    // this.postCreated.emit(post);
    this.postsService.addPost(Form.value.title, Form.value.content);
  }

}
