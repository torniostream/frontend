import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
    private subject = new Subject<any>();
    private subjectuser = new Subject<any>(); 
    
    sendMuteEvent(userNickname: String) {
      this.subjectuser.next(userNickname);
    } 
    
    getMuteEvent(): Observable<any> {
      return this.subjectuser.asObservable();
    }

    openAdminPanel(): Observable<any> {
      return this.subject.asObservable();
    }

    sendAdminEvent() {
      this.subject.next();
    }
}