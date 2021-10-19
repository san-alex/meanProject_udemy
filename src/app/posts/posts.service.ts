// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { Post } from './post.model';

// @Injectable({ providedIn: 'root' })
// export class PostsService {
//   private posts: Post[] = [];
//   private postsUpdated = new Subject<Post[]>();

//   constructor(private http: HttpClient, private router: Router) {}

//   getPosts() {
//     this.http
//       .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
//       .pipe(
//         map((postData) => {
//           return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
//             return {
//               title: post.title,
//               content: post.content,
//               id: post._id,
//             };
//           });
//         })
//       )
//       .subscribe((data) => {
//         this.posts = data;
//         this.postsUpdated.next([...this.posts]);
//       });
//   }

//   getPostUpdateListener() {
//     return this.postsUpdated.asObservable();
//   }

//   getPost(id: string) {
//     return this.http.get<{ _id: string; title: string; content: string }>(
//       "http://localhost:3000/api/posts/" + id
//     );
//   }

//   addPost(title: string, content: string) {
//     const post: Post = { id: '', title: title, content: content };
//     this.http
//       .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
//       .subscribe((responseData) => {
//         console.log(responseData.message);
//         const id = responseData.postId;
//         post.id = id;
//         this.posts.push(post);
//         this.postsUpdated.next([...this.posts]);
//       });
//   }

//   updatePost(id: string, title: string, content: string) {
//     const post: Post = { id: id, title: title, content: content };
//     this.http
//       .put("http://localhost:3000/api/posts/" + id, post)
//       .subscribe(response => {
//         const updatedPosts = [...this.posts];
//         const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
//         updatedPosts[oldPostIndex] = post;
//         this.posts = updatedPosts;
//         this.postsUpdated.next([...this.posts]);
//         this.router.navigate(["/"]);
//       });
//   }

//   delPost(postId: string) {
//     this.http
//       .delete('http://localhost:3000/api/posts/' + postId)
//       .subscribe(() => {
//         console.log('deleted!');
//         const updatedPosts = this.posts.filter(post => post.id !== postId);
//         this.posts = updatedPosts;
//         this.postsUpdated.next([...this.posts]);
//       });
//   }
// }


import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }
}
