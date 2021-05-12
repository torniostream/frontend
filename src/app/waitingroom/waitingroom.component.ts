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
import { Observable, Subscription, timer } from 'rxjs';
import { SharedService } from './../shared.service';

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
  verticalPositionParticipants: MatSnackBarVerticalPosition = 'bottom';

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
  millisecondStart = 0; //timer
  source = timer(1000, 1000);

  clickEventSubscription:Subscription;

  //PROVA USER LIST
  provaUser = [{ nickname: "jhonny", avatar: { id: 1, path: "/assets/images/avatars/avatar8.png" }, isAdmin: null, isInhibited: true }, { nickname: "jhonny", avatar: { id: 1, path: "/assets/images/avatars/avatar1.png" }, isAdmin: null, isInhibited: false }];

  provauser: User;
  // Registered user to the lobby (room)
  public users: User[] = new Array<User>();

  // Active subscriptions list, we need to clear after the view is unloaded.
  // Or else we get observable leaks and memory explodes. 
  // We don't want to do that, do we?
  private subscriptions: Subscription[] = new Array<Subscription>();

  constructor(private api: ApiService, private _snackBar: MatSnackBar,
    private SharedService: SharedService) {

        this.clickEventSubscription = this.SharedService.getMuteEvent(this.provauser).subscribe(() =>{ this.muteUser(this.provauser);});
        this.clickEventSubscription = this.SharedService.openAdminPanel().subscribe(() =>{ this.showParticipants();})
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  ngOnInit(): void {
    // Get a new customized greet because we are nice people.
    this.greet = this.getGreeting();

    this.millisecondStart = this.times.getMilliseconds();
    this.source.subscribe(d => this.manageNotification());

    this.subscriptions.push(this.api.onUserResumed().subscribe((u) => {
      this.newNotification(u, " has resumed the video.");
      this.play = true;
    }));

    this.subscriptions.push(this.api.onUserPaused().subscribe((u) => {
      this.newNotification(u, " has paused the video");
      this.play = false;
    }));

    this.subscriptions.push(this.api.onUserJoin().subscribe(u => {
      this.users.push(u);
      this.newNotification(u, " has joined the room!");
    }));

    this.subscriptions.push(this.api.onUserLeave().subscribe(u => {
      const userIndex = this.users.findIndex((user) => {
        u.nickname === user.nickname
      });

      // Remove the user from our list
      if (userIndex > -1) {
        this.users.splice(userIndex, 1);
      }

      this.newNotification(u, " has left the room.");
    }));

    this.subscriptions.push(this.api.getPosition().subscribe(p => this.position = p));
    this.subscriptions.push(this.api.getVideoDuration().subscribe(d => this.duration = d));

    this.api.onUserJoin().subscribe(u => this.newNotification(u, " has joined the room!"));
    this.api.onUserLeave().subscribe(u => this.newNotification(u, " has left the room."));
  }

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
      this.notificationQueue.push(notification); //aggiungo la notifica alla coda
    }
  }

  manageNotification() {
    if ((this.notificationQueue.length > 0) && ((this.times.getMilliseconds() - this.millisecondStart) >= 3000)) {
      this.showNotification(this.notificationQueue[0]);
    }
    return;
  }

  showNotification(notification: Notification) {
    this.millisecondStart = this.times.getMilliseconds(); //inizializzo il timer ad ogni notifica
    this._snackBar.openFromComponent(NotificationComponent, {
      data: notification,
      horizontalPosition: this.horizontalPositionNotification,
      verticalPosition: this.verticalPositionNotification,
      duration: 3000,
    });
    if (this.notificationQueue.length > 0)
      this.notificationQueue.shift(); //rimuovo la prima notifica della coda
  }

  showParticipants() {                                      //TODO capire come chiamare questa funzione dal player
    this._snackBar.openFromComponent(UserListComponent, {
      data: this.provaUser,
      panelClass: ['userlistsnakbar'],
      horizontalPosition: this.horizontalPositionParticipants,
      verticalPosition: this.verticalPositionParticipants,
    });
  }

  muteUser(user: User) {
    console.log(user);
  }
}
