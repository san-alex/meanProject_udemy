import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    let url = "http://localhost:3000/api/user/login";
    const data = {
      email: email,
      password: password
    }
    this.http.post(url, data).subscribe((res) => {
      console.log(res);
    });
  }

  signup(email:string, password: string) {
    let url = "http://localhost:3000/api/user/signup";
    const data = {
      email: email,
      password: password
    }
    this.http.post(url, data).subscribe((res) => {
      console.log(res);
    });
  }
}
