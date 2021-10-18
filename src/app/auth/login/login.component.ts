import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  templateUrl: "login.component.html",
  styleUrls: ['login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(private authServ: UserService) {}

  onFormSubmit(event: NgForm) {
    if(event.invalid) {
      return;
    }
    this.isLoading = true;
    this.authServ.login(event.value.email, event.value.password);
  }
}
