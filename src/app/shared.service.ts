import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {User} from './models/user';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
    private subject = new Subject<any>(); 
    
    sendMuteEvent(user: User) {
      this.subject.next(user);
    } 
    
    getMuteEvent(user: User): Observable<any> {
      return this.subject.asObservable();
    }

    openAdminPanel(): Observable<any> {
      return this.subject.asObservable();
    }

    sendAdminEvent() {
      this.subject.next();
    }
}