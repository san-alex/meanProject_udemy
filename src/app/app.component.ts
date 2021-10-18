import { Component, OnInit } from '@angular/core';
import { UserService } from './auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'meanchk';

  constructor(private auth: UserService) {}

  ngOnInit() {
    this.auth.autoAuthUser();
  }
}
