import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator/paginator';
import { Subscription } from 'rxjs';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService, private authService: AuthService) { }
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;
  postCount = 0;
  pageSize = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated = false;
  private authListenerSub: Subscription;
  userID: string;

  ngOnInit(): void {
    this.isLoading = true;
    this.userID = this.authService.getUserId();
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.posts = postData.posts;
        this.postCount = postData.postCount;
        this.isLoading = false;
    });
    this.isUserAuthenticated = this.authService.isUserAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(isUserAuthenticated => {
      this.isUserAuthenticated = isUserAuthenticated;
      this.userID = this.authService.getUserId();
    });
  }
  onPageChange(event: PageEvent){
    this.isLoading = true;
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }
}
