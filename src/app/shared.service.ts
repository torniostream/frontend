import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
    private subject = new Subject<any>();
    private userMute = new Subject<User>();
    private userUnMute = new Subject<User>();
    
    sendMuteEvent(user: User) {
      this.userMute.next(user);
    }

    sendUnMuteEvent(user: User) {
      this.userUnMute.next(user);
    }
    
    getMuteEvent(): Observable<User> {
      return this.userMute.asObservable();
    }

    getUnMuteEvent(): Observable<User> {
      return this.userUnMute.asObservable();
    }

    openAdminPanel(): Observable<string> {
      return this.subject.asObservable();
    }

    sendAdminEvent(nickname: string) {
      this.subject.next(nickname);
    }
}