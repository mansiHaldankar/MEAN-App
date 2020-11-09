import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm, AsyncValidator, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;
  imagePreview: any;
  isLoading = false;
  postForm: FormGroup;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  // @Output() postCreated = new EventEmitter <Post> ();

  ngOnInit(): void {
    this.postForm = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')){
            this.mode = 'edit';
            this.postId = paramMap.get('postId');
            this.isLoading = true;
            this.postsService.getPost(this.postId).subscribe(postData => {
              this.isLoading = false;
              this.post = {
                id: postData.post._id,
                title: postData.post.title,
                content: postData.post.content
              }
              this.postForm.setValue({
                title: this.post.title,
                content: this.post.content
              })
            });
        }
        else{
          this.mode = 'create';
          this.postId = null;
        }
    });
  }
  // tslint:disable-next-line: typedef

  onUploadedImage(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.postForm.patchValue({'image': File});
    this.postForm.get('image').updateValueAndValidity();
    const render = new FileReader();
    render.onload = () => {
      this.imagePreview = render.result;
    }
    render.readAsDataURL(file);
  }


  onSavePost(){
    if(this.postForm.invalid){
      return true;
    }
    // const post: Post = {
    //   title : Form.value.title,
    //   content : Form.value.content
    // };
    // this.postCreated.emit(post);
    // tslint:disable-next-line: triple-equals
    this.isLoading = true;
    if (this.mode == 'create'){
        this.postsService.addPost(
          this.postForm.value.title,
          this.postForm.value.content,
          this.postForm.value.image);

    }
    else{
      this.postsService.updatePost( this.postId, this.postForm.value.title, this.postForm.value.content);
    }
    this.postForm.reset();

  }

}
