import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import * as kurentoUtils from 'kurento-utils';
import { Observable, Subject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  myWebSocket: WebSocketSubject<any> = webSocket(
    'ws://' + environment.apiurl + '/player'
  );

  private webRtcPeer: any;
  // position: any;
  isSeekable = false;

  initSeekable = 0;
  endSeek = 0;
  duration: Subject<number> = new Subject<number>();
  position: Subject<number> = new Subject<number>();
  isPlaying: Subject<boolean> = new Subject<boolean>();

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
    console.log('Pausing video ...');
    const message = {
      id : 'pause'
    };
    this.sendMessage(message);
  }

  resume() {
    console.log('Resuming video ...');
    const message = {
      id : 'resume'
    };
    this.sendMessage(message);
  }

  getIsPlaying(): Observable<boolean> {
    return this.isPlaying.asObservable();
  }

  private onMessage(message) {
    console.log(message);
    const parsedMessage = message;

    console.log('Received message: ' + message);

    switch (parsedMessage.id) {
    case 'startResponse':
      this.webRtcPeer.processAnswer(message.sdpAnswer, (error) => {
        if (error) {
          return console.error(error);
        }
      });
      this.isPlaying.next(true);
      // startResponse(parsedMessage);
      break;
    case 'error':
      console.log('Error message from server: ' + parsedMessage.message);
      this.isPlaying.next(false);
      break;
    case 'paused':
      this.isPlaying.next(false);
      break;
    case 'resumed':
      this.isPlaying.next(true);
      break;
    case 'playEnd':
      this.isPlaying.next(false);
      // playEnd();
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

  registerToRoom(roomid: string, videoelement: any) {
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
          roomid
        };
        this.sendMessage(message);
      });
    });
  }
}
