import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { NotificationComponent } from '../../app/notification/notification.component';
import { ErrorComponent } from '../error/error.component';
import { Notification } from '../models/notification';
import { UserListComponent } from '../user-list/user-list.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Subscription, timer } from 'rxjs';
import { SharedService } from './../shared.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { exit } from 'process';

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
  roomName: string;

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
  
  timeLeft: string ="00:00:00";
  durationTot: string="00:00:00";

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

  @Input() adminNickname:string;

  constructor(private api: ApiService, private _snackBar: MatSnackBar,
    private SharedService: SharedService, private _router: Router, private _activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    this.api.setVideoElement(this.elementVideoRef);
  }

  getMyUser(): User {
    var candidates = this.users.filter((u) => u.nickname === this.user.nickname);
    if (candidates.length != 0) {
      return candidates[0];
    }
    return null;
  }

  amIAdmin(): boolean {
    var candidates = this.users.filter((u) => u.nickname === this.user.nickname);
    if (candidates.length != 0) {
      return candidates[0].isAdmin;
    }
    return false;
  }

  ngOnInit(): void {
    // Ugly hack, again :P
    if (this._router.url.indexOf("player") != -1) {
      this.subscriptions.push(this._activatedRoute.queryParams.subscribe(params => {
        this.roomUUID = params.room;
        this.roomName = params.name;
        this.subscriptions.push(this.api.getParticipants(this.roomUUID).subscribe(users => {
          this.usersPreview = this.usersPreview.concat(users);
        }));
      }));
      
      // do not show admin
      this.showAdmin = false;
    } else {
      this.showWaitingRoom = false;
    }

    // Get a new customized greet because we are nice people.
    this.greet = this.getGreeting();

    this.millisecondStart = this.times.getMilliseconds();
    this.source.subscribe(time => this.manageNotification());

    this.subscriptions.push(this.SharedService.openAdminPanel().subscribe((nickname) =>{ this.showParticipants(nickname);}))

    this.subscriptions.push(this.SharedService.getMuteEvent().subscribe((u) => {
      this.api.inhibitUser(u);
    }));

    this.subscriptions.push(this.SharedService.getUnMuteEvent().subscribe((u) => {
      this.api.uninhibitUser(u);
    }));

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
    this.subscriptions.push(this.api.getPosition().subscribe(p => this.timeLeft = this.formatTime(p)));
    this.subscriptions.push(this.api.getVideoDuration().subscribe(d => this.duration = d));
    this.subscriptions.push(this.api.getVideoDuration().subscribe(d => this.durationTot =this.formatTime(d)));

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

    this.subscriptions.push(this.api.onBackendError().subscribe(err => {
      this.showError(err.message);
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
    if (this.getMyUser() && this.getMyUser().isInhibited == true) {
      this.play = !isPlaying;
      this.showError("You're inhibited. You can't do that.")
      return;
    }

    isPlaying ? this.api.resume() : this.api.pause();
    this.play = isPlaying;
  }

  getPlaying(): boolean {
    return this.play;
  }

  setPosition(newPosition: number) {
    if (this.getMyUser() && this.getMyUser().isInhibited == true) {
      this.showError("You're inhibited. You can't do that.")
      return;
    }

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

  showParticipants(nickname) {    
        if(nickname == this.adminNickname)          //se il nickname che torna e' uguale a quello dell'admin allora apri la scheramta
        {
          this._snackBar.openFromComponent(UserListComponent, {
            data: this.users.filter((u) => u.nickname != this.user.nickname),
            panelClass: ['userlistsnakbar'],
            horizontalPosition: this.horizontalPositionParticipants,
            verticalPosition: this.verticalPositionParticipants,
          });
        }
  }

  showError(text: string) {
    this._snackBar.openFromComponent(ErrorComponent, {
      data: { message: text },
      horizontalPosition: this.horizontalPositionNotification,
      verticalPosition: this.verticalPositionNotification,
      duration: 3000,
    });
  }

  toggleAdminPage(){
    this.showAdmin = false;
    this.showPlayer();
  }

  private formatTime(duration): string {
    var result = Math.floor(duration/(1000*60*60)) + ":" + Math.floor(duration/(1000*60))%60 + ":" + Math.floor(duration/1000)%60;
    return result;
  }

  getAdminNickname(nickname: string){
    this.adminNickname = nickname;
  }
}
