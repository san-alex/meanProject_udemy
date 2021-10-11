import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";

@Component({
  templateUrl: "login.component.html",
  styleUrls: ['login.component.css']
})
export class LoginComponent {

  constructor(private authServ: UserService) {}

  onFormSubmit(event: NgForm) {
    if(event.invalid) {
      return;
    }
    this.authServ.login(event.value.email, event.value.password);
  }
}
