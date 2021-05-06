import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit, AfterViewInit {
  newRoom: boolean = false;
  buttonTitle = "Lets go into the jungle";

  greets = ['Ciao!', 'Hey!', 'Salve!', 'Ehi, come va?'];
  greet: string;

  name_group = "Pasta al tornio";
  selected = 'option2';

  // Input form bindings
  nickname: string;
  roomUUID: string;

  user: User = { nickname: null, avatar: null, isAdmin: null, isInhibited: null };

  // Video Element Ref, it's a ugly hack
  elementVideoRef: ElementRef;

  addVideo(video: ElementRef) {
    this.elementVideoRef = video;
  }

  public enabled: boolean = false;

  play: boolean = false;

  // Registered user to the lobby (room)
  public users: Array<User> = new Array<User>();

  constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  ngOnInit(): void {
    this.greet = this.getGreeting();

    this.api.onUserResumed().subscribe((u) => {
      console.log(u.nickname + " has resumed the video.");
      this.play = true;
    });

    this.api.onUserPaused().subscribe((u) => {
      console.log(u.nickname + " has paused the video");
      this.play = false;
    });

    this.api.onUserJoin().subscribe(u => console.log(u.nickname + " has joined the room!"));
    this.api.onUserLeave().subscribe(u => console.log(u.nickname + " has left the room."));
    console.log(this.users);
  }

  getGreeting(): string {
    return this.greets[Math.floor(Math.random() * this.greets.length)];
  }

  setAvatar(avatar) {
    this.user.avatar = avatar;
  }

  joinRoom() {
    this.api.registerToRoom(this.roomUUID, this.user);

    this.enabled = !this.enabled;
    this.users.push(this.user);
  }

  showPlayer() {
    this.enabled = true;
  }

  CreateNewRoom(){
    this.newRoom = !this.newRoom;
    if(this.newRoom) this.buttonTitle = "close admin section";
    else this.buttonTitle = "Lets go into the jungle";
  }

  setPlaying(isPlaying: boolean) {
    isPlaying ? this.api.resume() : this.api.pause();
  }

  getPlaying(): boolean {
    return this.play;
  }
}
