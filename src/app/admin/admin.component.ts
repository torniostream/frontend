import { Component, OnInit } from '@angular/core';
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

  constructor(private api: ApiService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.api.getUUID().subscribe(uuid => this.generatedLink = environment.baseURL.toString() + "/player?room=" + uuid.toString());

    //--form --
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  generateLink() {
    console.log(this.movieLink);
    console.log(this.nickname);
    this.api.createRoom(this.movieLink, { nickname: this.nickname, isInhibited: false, isAdmin: true, avatar: this.admin.avatar});
    this.isEditable = !this.isEditable;
  }

  setAvatar(avatar) {
    this.admin.avatar = avatar;
  }
}
