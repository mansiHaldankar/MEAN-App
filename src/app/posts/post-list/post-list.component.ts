import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService) { }
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
    });
  }
  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
