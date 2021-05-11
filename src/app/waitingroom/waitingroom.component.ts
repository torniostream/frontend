import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { NotificationComponent } from '../../app/notification/notification.component';
import { map } from 'rxjs/operators';
import { Notification } from '../models/notification';
import { UserListComponent } from '../user-list/user-list.component'; 
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { exit } from 'process';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit, AfterViewInit {
  newRoom: boolean = false;

  horizontalPositionNotification: MatSnackBarHorizontalPosition = 'end';
  verticalPositionNotification: MatSnackBarVerticalPosition = 'top';

  horizontalPositionParticipants: MatSnackBarHorizontalPosition = 'end';
  verticalPositionParticipants: MatSnackBarVerticalPosition = 'top';

  greets = ['Ciao!', 'Hey!', 'Salve!', 'Ehi, come va?'];
  greet: string;

  name_group = "Pasta al tornio";
  selected = 'option2';

  notificationQueue = Array<Notification>();
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

  times = new Date();
  millisecond = 3000; //timer

  //PROVA USER LIST\
  provaUser = [{nickname: "jhonny", avatar:{id: 1, path:"/assets/images/avatar/avatar1.png"},isAdmin: null, isInhibited: null},{nickname: "jhonny", avatar:{id: 1, path:"/assets/images/avatar/avatar1.png"},isAdmin: null, isInhibited: null}];

  // Registered user to the lobby (room)
  public users: Array<User> = new Array<User>();

  constructor(private api: ApiService, private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  ngOnInit(): void {                                             //TODO: devo hchiamare manageNotification ogni secondo
    this.millisecond = this.times.getMilliseconds();

    this.greet = this.getGreeting();

    this.api.onUserResumed().subscribe((u) => {
      this.newNotification(u, " has resumed the video.");
      this.play = true;
    });

    this.api.onUserPaused().subscribe((u) => {
      this.newNotification(u, " has paused the video");
      this.play = false;
    });

    this.api.onUserJoin().subscribe(u => this.newNotification(u, " has joined the room!"));
    this.api.onUserLeave().subscribe(u => this.newNotification(u, " has left the room."));

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

  setPlaying(isPlaying: boolean) {
    isPlaying ? this.api.resume() : this.api.pause();
    this.play = isPlaying;
  }

  getPlaying(): boolean {
    return this.play;
  }

  setPosition(newPosition: number) {
    this.api.doSeek(newPosition);
  }

  newNotification(user: User, text: string) {
    let notification: Notification = { user: user, message: text }; //creo l'istanza della notifica
    if (this.notificationQueue.length == 0) {   //se la lista e' vuota fai vedere l'ultima notifica arrivata
      this.showNotification(notification);
    }
    else {
      this.notificationQueue.push(notification); //aggiungo la notificq alla coda
    }
  }

  manageNotification(){
    if (this.notificationQueue.length > 0) {
      this.showNotification(this.notificationQueue[0]);
    }
    return;
  }

  showNotification(notification : Notification){
    this.millisecond = 0;
    this._snackBar.openFromComponent(NotificationComponent, {
      data: notification,
      horizontalPosition: this.horizontalPositionNotification,
      verticalPosition: this.verticalPositionNotification,
      duration: 3000,
    });
  }

  showParticipants() {                                      //TODO capire come chiamare questa funzione dal player
    this._snackBar.openFromComponent(UserListComponent, {
      data:this.provaUser,
      horizontalPosition: this.horizontalPositionParticipants,
      verticalPosition: this.verticalPositionParticipants,
    });
  }
}
