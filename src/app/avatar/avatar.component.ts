import { Component, OnInit , ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  Output,
  EventEmitter} from '@angular/core';
import {Avatar} from '../models/avatar';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit{
  boxShow = false;
  @Output() newAvatarEvent = new EventEmitter<Avatar>();
  selectedAvatar: Avatar;
  
  avatarList: Avatar[] = [
    {
      id: 1, path: "/assets/images/avatars/avatar1.png"
    },
    {
      id: 2, path: "/assets/images/avatars/avatar2.png"
    },
    {
      id: 3, path: "/assets/images/avatars/avatar3.png"
    },
    {
      id: 4, path: "/assets/images/avatars/avatar4.png"
    },
    {
      id: 5, path: "/assets/images/avatars/avatar5.png"
    },
    {
      id: 6, path: "/assets/images/avatars/avatar6.png"
    },
    {
      id: 7, path: "/assets/images/avatars/avatar7.png"
    },
    {
      id: 8, path: "/assets/images/avatars/avatar8.png"
    },
    {
      id: 9, path: "/assets/images/avatars/avatar9.png"
    },
    {
      id: 10, path: "/assets/images/avatars/avatar10.svg"
    }
  ]

  ngOnInit(): void {  
    this.boxShow= false;
    this.selectedAvatar = this.getAvatar();
    this.newAvatarEvent.emit(this.selectedAvatar);
  }

  getAvatar(): Avatar {
    return this.avatarList[Math.floor(Math.random() * this.avatarList.length)];
  }

  click() : void{
    this.boxShow =! this.boxShow;
    console.log('ciao');
  }

  close(){
    this.boxShow = false;
  }

  avatarSelect(avatar){
    this.selectedAvatar = avatar;
    this.boxShow = false;
    this.newAvatarEvent.emit(avatar);
  }

}
