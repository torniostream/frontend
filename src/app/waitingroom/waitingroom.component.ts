import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { User } from '../models/user';
import { NotificationComponent } from '../../app/notification/notification.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit, AfterViewInit, OnDestroy {
  newRoom: boolean = false;

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

  ngOnInit(): void {
    // Get a new customized greet because we are nice people.
    this.greet = this.getGreeting();

    this.subscriptions.push(this.api.onUserResumed().subscribe((u) => {
      this.showNotification(u, " has resumed the video.");
      this.play = true;
    }));

    this.subscriptions.push(this.api.onUserPaused().subscribe((u) => {
      this.showNotification(u, " has paused the video");
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

  showNotification(user: User, text: string) {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: { nickname: user.nickname, path: user.avatar.path, command: text },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
    });
  }
}
