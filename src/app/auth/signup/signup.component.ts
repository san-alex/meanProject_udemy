import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  templateUrl: "signup.component.html"
})
export class SignupComponent {
  constructor(private authServ: UserService) {}

  onFormSubmit(event: NgForm) {
    if(event.invalid) {
      return;
    }
    this.authServ.signup(event.value.email, event.value.password);
  }
}
