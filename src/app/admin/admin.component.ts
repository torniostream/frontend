import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  generatedLink: string = "djsigvhjfsdfuvhsdnuv";
  //form
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  admin: User = { nickname: null, avatar: null, isAdmin: null, isInhibited: null };

  constructor(private api: ApiService,private _formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.api.getUUID().subscribe(uuid => this.generatedLink = "http://" + environment.baseURL + "/play?room=" + uuid);

    //--form --
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  generateLink() {
    this.api.createRoom(this.filmLink, { nickname: this.admin.nickname, isInhibited: false, isAdmin: true, avatar: this.admin.avatar});
    this.isEditable = !this.isEditable;
   // console.log(this.admin.nickname + this.admin.avatar);
  }

  setAvatar(avatar) {
    this.admin.avatar = avatar;
  }
}
