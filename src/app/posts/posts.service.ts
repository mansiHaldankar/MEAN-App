import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private router: Router) { }
  private posts: Post[] = [];
  private updatedPosts = new Subject <Post[]> ();

  getPosts(){
    // return [...this.posts];
    this.http.get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.updatedPosts.next([...this.posts]);
      });
  }
  getPostUpdateListener(){
    return this.updatedPosts.asObservable();
  }
  // tslint:disable-next-line: typedef
  getPost(postId: string){
    return this.http.get<{ post: any }>('http://localhost:3000/api/posts/' + postId);
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // title : for image name
    console.log( "Post Data" + postData);
    this.http.post <{ message: string, post: any }>('http://localhost:3000/api/posts', postData)
    .subscribe(responseData => {
      console.log(responseData);
      // const posts: Post = { id: responseData.post._id }
      // this.updatedPosts.next([...this.posts]);
      // this.router.navigate(["/"]);
      });
  }
  updatePost (postId: string, title: string, content: string){
    const post: Post =  {
      id: postId,
      title: title,
      content: content
    }
    this.http.put('http://localhost:3000/api/posts/' + postId, post)
    .subscribe((response) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(iPost => post.id == iPost.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.updatedPosts.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  // tslint:disable-next-line: typedef
  deletePost(postId: string){
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      console.log("Post Deleted");
      const updatedPost = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPost;
      this.updatedPosts.next([...this.posts]);
    });
  }
 }
