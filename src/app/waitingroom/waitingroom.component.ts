import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { NotificationComponent } from '../../app/notification/notification.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit, AfterViewInit {
  newRoom: boolean = false;
  buttonTitle = "Lets go into the jungle";

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

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

  // Media metadata
  position: number = 0;
  duration: number = 100;

  // Registered user to the lobby (room)
  public users: Array<User> = new Array<User>();

  constructor(private api: ApiService, private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  ngOnInit(): void {
    this.greet = this.getGreeting();

    this.api.onUserResumed().subscribe((u) => {
      this.showNotification(u, " has resumed the video.");
      this.play = true;
    });

    this.api.onUserPaused().subscribe((u) => {
      this.showNotification(u, " has paused the video");
      this.play = false;
    });

    this.api.onUserJoin().subscribe(u => this.showNotification(u," has joined the room!"));
    this.api.onUserLeave().subscribe(u => this.showNotification(u, " has left the room."));

    this.api.getPosition().subscribe(position => this.position = position);
    this.api.getVideoDuration().subscribe(duration => this.duration = duration);
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

  setPosition(newPosition: number) {
    this.api.doSeek(newPosition);
  }

  showNotification(user: User, text: string) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: { nickname: user.nickname, path: user.avatar.path, command: text},
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
    });
  }
}
