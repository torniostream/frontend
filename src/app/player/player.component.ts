import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Inject, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';
import { DOCUMENT } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  room: string;
}

@Component({
  selector: 'app-room-dialog',
  templateUrl: 'room.dialog.html',
})
export class RoomDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements AfterViewInit, OnInit {
  constructor(private api: ApiService, @Inject(DOCUMENT) private document: Document, public dialog: MatDialog) { }
  Playing = false;

  elem: any;
  isFullScreen: boolean;

  width = 0;

  position = 0;
  duration = 0;

  audioon = false;

  timeLeft = '00:00';

  @ViewChild('videoRef') divView: ElementRef;

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event){
    this.chkScreenMode();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '250px',
      data: {room: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.api.registerToRoom(result, this.divView.nativeElement);
      this.audioon = !this.divView.nativeElement.muted;
    });
  }

  ngOnInit(): void {
    this.chkScreenMode();
    this.elem = document.documentElement;
    this.api.getPosition().subscribe((pos) => {
      this.position = pos;
      console.log(pos);
      const totalSecondsRemaining = this.duration / 1000 - pos / 1000;

      const time = new Date(null);
      time.setSeconds(totalSecondsRemaining);
      let hours = null;

      if (totalSecondsRemaining >= 3600) {
        hours = (time.getHours().toString()).padStart(2, '0');
      }

      const minutes = (time.getMinutes().toString()).padStart(2, '0');
      const seconds = (time.getSeconds().toString()).padStart(2, '0');

      this.timeLeft = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    });
    this.api.getVideoDuration().subscribe((dur) => this.duration = dur);
    this.api.getIsPlaying().subscribe((play) => this.Playing = play);
  }

  toggleMute() {
    this.divView.nativeElement.muted = !this.divView.nativeElement.muted;
    this.audioon = !this.divView.nativeElement.muted;
  }

  onSeek(event) {
    const value = (event.value);
    console.log(value);
    this.api.doSeek(value);
  }

  seekRelative(sec: number) {
    this.api.doSeek(this.position + sec * 1000);
  }

  chkScreenMode(){
    if (document.fullscreenElement){
      // fullscreen
      this.isFullScreen = true;
    }else{
      // not in full screen
      this.isFullScreen = false;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'm':
        this.toggleMute();
        break;
      case ' ':
        this.togglePlaying();
    }
    console.log(event.key);
  }

  togglePlaying() {
    this.Playing ? this.api.pause() : this.api.resume();
    this.Playing = !this.Playing;
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    }
  }
}


