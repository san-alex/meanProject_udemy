import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  templateUrl: "signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent {
  isLoading = false;

  constructor(private authServ: UserService) {}

  onFormSubmit(event: NgForm) {
    if(event.invalid) {
      return;
    }
    this.isLoading = true;
    this.authServ.signup(event.value.email, event.value.password);
  }
}
