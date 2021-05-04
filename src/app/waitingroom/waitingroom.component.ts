import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit {

  newRoom: boolean = false;
  buttonTitle = "Lets go into the jungle";

  greets = ['Ciao!', 'Hey!', 'Salve!', 'Ehi, come va?'];
  greet: string;
  name_group = "Pasta al tornio";
  selected = 'option2';
  nickname: string;
  roomId: string;

  user: User = { nickname: null, avatar: null, isAdmin: null };
  prova: User = { nickname: "Mulaz1", avatar: null, isAdmin: null };

  public users: Array<User> = new Array<User>();


  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.greet = this.getGreeting();
    // this.route.queryParams.subscribe((params) => {
    //     this.roomId= params.room;
    // });

    //prova
    this.prova.nickname = "Mulaz1";
    this.prova.avatar = { id: 1, path: "/assets/images/avatars/avatar1.png" };
    this.prova.isAdmin = false;
    this.users.push(this.prova);
    console.log(this.users);
  }

  getGreeting(): string {
    return this.greets[Math.floor(Math.random() * this.greets.length)];
  }

  getParticipant() {
    //this.api.newParticipant().subscribe((user) => this.users.push(user));
  }

  removeParticipant() {
    //this.api.newParticipant().subscribe((user) => this.users.remove(user));
  }

  setAvatar(avatar) {
    this.user.avatar = avatar;
  }

  getNewUser(){
    console.log(this.user);
    this.user.isAdmin = false;
    this.users.push(this.user);
  }

  CreateNewRoom(){
    this.newRoom = !this.newRoom;
    if(this.newRoom) this.buttonTitle = "close admin section";
    else this.buttonTitle = "Lets go into the jungle";
  }

}
