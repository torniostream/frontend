import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  panelOpenState = false;
  roomName : string;
  filmLink: string;
  generatedLink: string;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUUID().subscribe(uuid => this.generatedLink = "http://"+environment.baseURL+"/play?room="+uuid);
  }
 
  generateLink(){
    this.api.createRoom(this.filmLink, {nickname: "user1", isInhibited: false, isAdmin: false, avatar: {id: 1, path: "/ciao.png"}});
  }
}
