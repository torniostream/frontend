import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';


export interface User {
  username: string;
  profilephotoid: number;
}

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  name = 'ciao';
  status="Ready";
  userList: User[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const code: string = this.route.snapshot.queryParamMap.get('code');
    console.log(code);
  }

  joinUser(){
    //this.api.newParticipant().subscribe(user) => this.userList.push(user);
    console.log('add');
  }

  leftUser(){
    //this.api.newParticipant().subscribe(user) => this.userList.remove(user);
    console.log('remove');
  }
}
