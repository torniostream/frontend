import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  usersPreview: User[] = new Array<User>();

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

  times = new Date();  //notificcation timer
  millisecondStart = 0; 
  source = timer(1000, 1000);

  // Registered user to the lobby (room)
  public users: User[] = new Array<User>();

  // Active subscriptions list, we need to clear after the view is unloaded.
  // Or else we get observable leaks and memory explodes. 
  // We don't want to do that, do we?
  private subscriptions: Subscription[] = new Array<Subscription>();

  showAdmin: boolean = true;
  showWaitingRoom: boolean = true;

  constructor(private api: ApiService, private _snackBar: MatSnackBar,
    private SharedService: SharedService, private _router: Router, private _activatedRoute: ActivatedRoute) {
        // this.clickEventSubscription = this.SharedService.openAdminPanel().subscribe(() =>{ this.showParticipants();})
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  ngOnInit(): void {
    this.subscriptions.push(this._activatedRoute.queryParams.subscribe(params => {
      this.roomUUID = params.room;
      this.subscriptions.push(this.api.getParticipants(this.roomUUID).subscribe(users => {
        this.usersPreview = this.usersPreview.concat(users);
      }));
    }));

    // Ugly hack, again :P
    if (this._router.url.indexOf("player") != -1) {
      // do not show admin
      this.showAdmin = false;
    } else {
      this.showWaitingRoom = false;
    }

    // Get a new customized greet because we are nice people.
    this.greet = this.getGreeting();

    this.millisecondStart = this.times.getMilliseconds();
    this.source.subscribe(time => this.manageNotification());

    this.SharedService.openAdminPanel().subscribe(() =>{ this.showParticipants();})

    this.SharedService.getMuteEvent().subscribe((u) => {this.muteUser(u)});

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

    this.subscriptions.push(this.api.onUserNewAdmin().subscribe(a => {
      const previousAdmin = this.users.find(previousAdmin => previousAdmin.isAdmin === true);

      // The previous admin can possibly already left the room 
      if (previousAdmin) {
        previousAdmin.isAdmin = false;
      }

      const newAdmin = this.users.find(u => a.nickname === u.nickname);
      newAdmin.isAdmin = true;

      this.showNotification({user: newAdmin, message: " is now an admin of the room"});
    }));

    this.subscriptions.push(this.api.onUserUninhibit().subscribe(user => {
      const userNoLongerInhibited = this.users.find(u => u.nickname === user.nickname);
      userNoLongerInhibited.isInhibited = false;

      this.showNotification({ user: userNoLongerInhibited, message: " is no longer inhibited." });
    }));

    this.subscriptions.push(this.api.onUserInhibit().subscribe(user => {
      const userInhibited = this.users.find(u => u.nickname === user.nickname);
      userInhibited.isInhibited = true;

      this.showNotification({ user: userInhibited, message: " is now inhibited and cannot pauses." });
    }));

    this.subscriptions.push(this.api.onUserSeek().subscribe(user => {
      this.showNotification({ user, message: " has sought the video." });
    }));
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
    this.showPlayer();
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

  showParticipants() {                                     
    this._snackBar.openFromComponent(UserListComponent, {
      data: this.users,
      panelClass: ['userlistsnakbar'],
      horizontalPosition: this.horizontalPositionParticipants,
      verticalPosition: this.verticalPositionParticipants,
    });
  }

  muteUser(userNickname: String) {
    this.users.forEach(element => {
      if(element.nickname == userNickname){
        element.isInhibited = !element.isInhibited;
      }
    });
    
  }
}
