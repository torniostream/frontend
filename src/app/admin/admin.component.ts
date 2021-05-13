import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  panelOpenState = false;
  roomName: string;
  filmLink: string;
  generatedLink = "";
  //form
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  movieLink = "";
  nickname = "";

  isEditable = false;
  admin: User = { nickname: null, avatar: null, isAdmin: null, isInhibited: null };

  @Output() changePageEvent = new EventEmitter<any>();
  @Output() nicknameEvent = new EventEmitter<string>();

  constructor(private api: ApiService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.api.getUUID().subscribe(uuid => this.generatedLink = environment.baseURL.toString() + "/player?room=" + uuid.toString() + "&name=" + this.roomName);

    //--form --
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  generateLink() {
    this.api.createRoom(this.movieLink, { nickname: this.nickname, isInhibited: false, isAdmin: true, avatar: this.admin.avatar});
    this.isEditable = !this.isEditable;
  }

  setAvatar(avatar) {
    this.admin.avatar = avatar;
  }

  hideAdminPage(){
    this.changePageEvent.emit();
  }

  sendNickname(){
    console.log(this.nickname);
    this.nicknameEvent.emit(this.nickname);

  }
}
