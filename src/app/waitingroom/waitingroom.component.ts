import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

export interface User{
  nickname: string;
  avatarId: number;
  state: string;
}
@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit {

  constructor(private api: ApiService,private route: ActivatedRoute) {
  }

  greets = ['Ciao!', 'Hey!', 'Salve!', 'Ehi, come va?'];
  greet: string;
  name_group = "Pasta al tornio";
  selected = 'option2';
  nickname: string;
  roomId: string;


  public users: Array<User> = new Array<User>();

  prova: User;

  ngOnInit(): void {
    this.greet = this.getGreeting();
    // this.route.queryParams.subscribe((params) => {
    //     this.roomId= params.room;
    // });

    //prova
    this.prova.nickname = "Mulaz1";
    this.prova.avatarId = 1;
    this.prova.state = "Partecipant";
    this.users.push(this.prova);
    console.log(this.users);
  }

  getGreeting(): string {
    return this.greets[Math.floor(Math.random() * this.greets.length)];
  }

  getParticipant(){
    //this.api.newParticipant().subscribe((user) => this.users.push(user));
  }

  removeParticipant(){
    //this.api.newParticipant().subscribe((user) => this.users.remove(user));
  }


}
