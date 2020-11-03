import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }
  private posts: Post[] = [];
  private updatedPosts = new Subject <Post[]> ();

  getPosts(){
    // return [...this.posts];
    this.http.get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.updatedPosts.next([...this.posts]);
      });
  }
  getPostUpdateListener(){
    return this.updatedPosts.asObservable();
  }
  addPost(title: string, content: string){
    const post: Post = { id: null, title: title, content: content};
    this.http.post <{ message: string }>('http://localhost:3000/api/addPosts', post)
    .subscribe(responseData => {
      console.log(responseData);
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
      });
  }

 }
