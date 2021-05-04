import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import * as kurentoUtils from 'kurento-utils';
import { Observable, Subject, timer } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { Error } from '../models/error';
import { User } from '../models/user';

interface UserEvent {
  event: Event,
  user: User,
}

enum Event {
  Join = 1,
  Leave,
  Pause,
  Resume,
  Stop,
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  myWebSocket: WebSocketSubject<any> = webSocket(
    environment.apiurl
  );

  private webRtcPeer: any;
  isSeekable = false;

  initSeekable = 0;
  endSeek = 0;
  duration: Subject<number> = new Subject<number>();
  position: Subject<number> = new Subject<number>();
  isPlaying: Subject<boolean> = new Subject<boolean>();

  errSubject: Subject<Error> = new Subject<Error>();
  userEventSubject: Subject<UserEvent> = new Subject<UserEvent>();
  uuidSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.myWebSocket.subscribe(
      msg => {
        console.log('message received: ' + msg);
        this.onMessage(msg);
      },
      // Called whenever there is a message from the server
      err => console.log(err),
      // Called if WebSocket API signals some kind of error
      () => console.log('complete')
      // Called when connection is closed (for whatever reason)
   );
    timer(0, 1000).subscribe(() => this.getPosition());
  }

  pause() {
    const message = {
      id : 'pause'
    };
    this.sendMessage(message);
  }

  resume() {
    const message = {
      id : 'resume'
    };
    this.sendMessage(message);
  }

  onBackendError(): Observable<Error> {
    return this.errSubject.asObservable();
  }

  onUserJoin(): Observable<User> {
    return this.userEventSubject.pipe(
      filter((event) => event.event === Event.Join),
      pluck("user"),
      );
  }

  onUserLeave(): Observable<User> {
    return this.userEventSubject.pipe(
      filter((event) => event.event === Event.Leave),
      pluck("user"),
    );
  }

  onUserResumed(): Observable<User> {
    return this.userEventSubject.pipe(
      filter((e) => e.event === Event.Resume),
      pluck("user"),
    );
  }

  onUserPaused(): Observable<User> {
    return this.userEventSubject.pipe(
      filter((e) => e.event === Event.Pause),
      pluck("user"),
    )
  }

  getUUID(): Observable<string> {
    return this.uuidSubject.asObservable();
  }

  private onMessage(message) {
    console.log(message);
    const parsedMessage = message;

    switch (parsedMessage.id) {
    case 'startResponse':
      this.webRtcPeer.processAnswer(message.sdpAnswer, (error) => {
        if (error) {
          return console.error(error);
        }
      });
      break;
    case 'error':
      this.errSubject.next({message: parsedMessage.message});
      break;
    case 'paused':
      this.userEventSubject.next({event: Event.Pause, user: parsedMessage.initiator});
      break;
    case 'resumed':
      this.userEventSubject.next({event: Event.Resume, user: parsedMessage.initiator});
      break;
    case 'newUser':
      this.userEventSubject.next({event: Event.Join, user: parsedMessage.user});
      break;
    case 'userLeft':
      this.userEventSubject.next({event: Event.Leave, user: parsedMessage.user})
      break;
    case 'uuid':
      this.uuidSubject.next(parsedMessage.uuid);
      break;
    case 'playEnd':
      this.userEventSubject.next({ event: Event.Stop, user: null });
      break;
    case 'videoInfo':
      this.showVideoData(parsedMessage);
      break;
    case 'iceCandidate':
      this.webRtcPeer.addIceCandidate(parsedMessage.candidate, (error) => {
        if (error) {
          return console.log('Error adding candidate: ' + error);
        }
      });
      break;
    case 'seek':
      console.log (parsedMessage.message);
      break;
    case 'position':
      this.position.next(parsedMessage.position);
      break;
    case 'iceCandidate':
      break;
    default:
      console.log('Unrecognized message', parsedMessage);
    }
  }

  doSeek(newPos: number) {
    const message = {
      id : 'doSeek',
      position: newPos
    };
    this.sendMessage(message);
  }

  getPosition(): Observable<number> {
    const message = {
      id : 'getPosition'
    };
    this.sendMessage(message);

    return this.position.asObservable();
  }

  private sendMessage(msg: any) {
    this.myWebSocket.next(msg);
  }

  showVideoData(parsedMessage) {
    // Show video info
    this.isSeekable = parsedMessage.isSeekable;

    this.initSeekable = parsedMessage.initSeekable;
    this.endSeek = parsedMessage.endSeekable;
    this.duration.next(parsedMessage.videoDuration);
  }

  getVideoDuration(): Observable<number> {
    return this.duration.asObservable();
  }

  registerToRoom(roomid: string, nickname: string, videoelement: any) {
    const userMediaConstraints = {
      audio : true,
      video : true
    };

    const options = {
      remoteVideo : videoelement,
      mediaConstraints : userMediaConstraints,
      onicecandidate : (candidate) => {
        console.log('Local candidate' + JSON.stringify(candidate));

        const message = {
          id : 'onIceCandidate',

          candidate
        };
        this.sendMessage(message);
      }
    };

    console.log('User media constraints' + userMediaConstraints);

    this.webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, (error) => {
      if (error) {
        return console.error(error);
      }

      this.webRtcPeer.generateOffer((err, sdpOffer) => {
        if (err) {
          return console.error('Error generating the offer');
        }

        console.log('Invoking SDP offer callback function ');

        const message = {
          id : 'register',
          sdpOffer,
          nickname,
          roomid
        };
        this.sendMessage(message);
      });
    });
  }
}
