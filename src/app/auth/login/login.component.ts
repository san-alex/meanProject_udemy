import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserService } from "../user.service";

@Component({
  templateUrl: "login.component.html",
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;

  private authStatusSub: Subscription;

  constructor(private authServ: UserService) {}

  ngOnInit() {
    this.authStatusSub = this.authServ.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onFormSubmit(event: NgForm) {
    if(event.invalid) {
      return;
    }
    this.isLoading = true;
    this.authServ.login(event.value.email, event.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
