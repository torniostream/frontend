import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
<<<<<<< HEAD
import { exit } from 'process';
=======
import { Observable, Subscription } from 'rxjs';
>>>>>>> 166cbd3ece0c086bdc1ac2e018ff0027b99be418

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public users: User[] = new Array<User>();

  // Active subscriptions list, we need to clear after the view is unloaded.
  // Or else we get observable leaks and memory explodes. 
  // We don't want to do that, do we?
  private subscriptions: Subscription[] = new Array<Subscription>();

  constructor(private api: ApiService, private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

<<<<<<< HEAD
  ngOnInit(): void {                                             //TODO: devo hchiamare manageNotification ogni secondo
    this.millisecond = this.times.getMilliseconds();

    this.greet = this.getGreeting();

    this.api.onUserResumed().subscribe((u) => {
      this.newNotification(u, " has resumed the video.");
=======
  ngOnInit(): void {
    // Get a new customized greet because we are nice people.
    this.greet = this.getGreeting();

    this.subscriptions.push(this.api.onUserResumed().subscribe((u) => {
      this.showNotification(u, " has resumed the video.");
>>>>>>> 166cbd3ece0c086bdc1ac2e018ff0027b99be418
      this.play = true;
    }));

<<<<<<< HEAD
    this.api.onUserPaused().subscribe((u) => {
      this.newNotification(u, " has paused the video");
=======
    this.subscriptions.push(this.api.onUserPaused().subscribe((u) => {
      this.showNotification(u, " has paused the video");
>>>>>>> 166cbd3ece0c086bdc1ac2e018ff0027b99be418
      this.play = false;
    }));

    this.subscriptions.push(this.api.onUserJoin().subscribe(u => {
      this.users.push(u);
      this.showNotification(u, " has joined the room!");
    }));

    this.subscriptions.push(this.api.onUserLeave().subscribe(u => {
      const userIndex = this.users.findIndex((user) => {
        u.nickname === user.nickname
      });

      // Remove the user from our list
      if (userIndex > -1) {
        this.users.splice(userIndex, 1);
      }

      this.showNotification(u, " has left the room.");
    }));

    this.subscriptions.push(this.api.getPosition().subscribe(p => this.position = p));
    this.subscriptions.push(this.api.getVideoDuration().subscribe(d => this.duration = d));

<<<<<<< HEAD
    this.api.onUserJoin().subscribe(u => this.newNotification(u, " has joined the room!"));
    this.api.onUserLeave().subscribe(u => this.newNotification(u, " has left the room."));
=======
    this.subscriptions.push(this.api.onUserNewAdmin().subscribe(a => {
      const previousAdmin = this.users.find(previousAdmin => previousAdmin.isAdmin === true);
      
      // The previous admin can possibly already left the room 
      if (previousAdmin) {
        previousAdmin.isAdmin = false;
      }

      const newAdmin = this.users.find(u => a.nickname === u.nickname);
      newAdmin.isAdmin = true;

      this.showNotification(newAdmin, " is now an admin of the room");
    }));

    this.subscriptions.push(this.api.onUserUninhibit().subscribe(user => {
      const userNoLongerInhibited = this.users.find(u => u.nickname === user.nickname);
      userNoLongerInhibited.isInhibited = false;

      this.showNotification(userNoLongerInhibited, " is no longer inhibited.");
    }));

    this.subscriptions.push(this.api.onUserInhibit().subscribe(user => {
      const userInhibited = this.users.find(u => u.nickname === user.nickname);
      userInhibited.isInhibited = true;

      this.showNotification(userInhibited, " is now inhibited and cannot pauses.");
    }));

    this.subscriptions.push(this.api.onUserSeek().subscribe(user => {
      this.showNotification(user, " has sought the video.");
    }));
  }
>>>>>>> 166cbd3ece0c086bdc1ac2e018ff0027b99be418

  ngOnDestroy() {
    // Clean all the subscriptions
    this.subscriptions.forEach((s) => s.unsubscribe());
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
<<<<<<< HEAD
      data: notification,
      horizontalPosition: this.horizontalPositionNotification,
      verticalPosition: this.verticalPositionNotification,
=======
      data: { nickname: user.nickname, path: user.avatar.path, command: text },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
>>>>>>> 166cbd3ece0c086bdc1ac2e018ff0027b99be418
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
