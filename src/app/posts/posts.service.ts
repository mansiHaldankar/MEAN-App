import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from './../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private router: Router) { }
  private posts: Post[] = [];
  private updatedPosts = new Subject <{posts: Post[], postCount: number}> ();

  getPosts(pageSize, currentPage){
    // return [...this.posts];
    const queryParam = `?pagesize=${pageSize}&page=${currentPage}`
    this.http.get<{ message: string; posts: any; maxPosts: number }>(
      BACKEND_URL + queryParam
      )
      .pipe(map(postData => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            creatorID : post.creatorID
          };
        }),
        maxPosts: postData.maxPosts
      };
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.updatedPosts.next({posts: [...this.posts], postCount: transformedPosts.maxPosts});
      });
  }
  getPostUpdateListener(){
    return this.updatedPosts.asObservable();
  }
  // tslint:disable-next-line: typedef
  getPost(postId: string){
    return this.http.get<{ post: any }>(BACKEND_URL + postId);
  }

  addPost(title: string, content: string){
    const post: Post = {
      id: null,
      title: title,
      content: content,
      creatorID: null
    };
    this.http.post <{ message: string, post: any }>(BACKEND_URL, post)
    .subscribe(responseData => {
      // post.id = responseData.post._id;
      // this.posts.push(post);
      // this.updatedPosts.next({[...this.posts]});
      this.router.navigate(["/"]);
      });
  }
  updatePost (postId: string, title: string, content: string){
    const post: Post =  {
      id: postId,
      title: title,
      content: content,
      creatorID: null
    }
    this.http.put(BACKEND_URL + postId, post)
    .subscribe((response) => {
      // const updatedPosts = [...this.posts];
      // const oldPostIndex = updatedPosts.findIndex(iPost => post.id == iPost.id);
      // updatedPosts[oldPostIndex] = post;
      // this.posts = updatedPosts;
      // this.updatedPosts.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  // tslint:disable-next-line: typedef
  deletePost(postId: string){
    return this.http.delete(BACKEND_URL + postId);
    // .subscribe(() => {
    //   console.log("Post Deleted");
    //   const updatedPost = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatedPost;
    //   this.updatedPosts.next([...this.posts]);
    // });
  }
 }
