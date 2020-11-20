import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  Inject,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { DOCUMENT } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements AfterViewInit, OnInit {
  constructor(
    private api: ApiService,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  Playing = false;

  elem: any;
  isFullScreen: boolean;

  width = 0;

  position = 0;
  duration = 0;

  audioon = false;

  timeLeft = '00:00';

  title = '';
  subtitle = '';

  @ViewChild('videoRef') divView: ElementRef;

  controlOpacity = 1;
  controlTimeout: any;

  roomId: string;

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event) {
    this.chkScreenMode();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.roomId = params.room;
    });
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
        hours = time.getHours().toString().padStart(2, '0');
      }

      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');

      this.timeLeft = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    });
    this.api.getVideoDuration().subscribe((dur) => (this.duration = dur));
    this.api.getIsPlaying().subscribe((play) => (this.Playing = play));
  }

  toggleMute() {
    this.divView.nativeElement.muted = !this.divView.nativeElement.muted;
    this.audioon = !this.divView.nativeElement.muted;
  }

  VolumeChange(volume){
    this.divView.nativeElement.volume = volume.value;
  }
S

  onSeek(event) {
    const value = event.value;
    console.log(value);
    this.api.doSeek(value);
  }

  seekRelative(sec: number) {
    this.api.doSeek(this.position + sec * 1000);
  }

  chkScreenMode() {
    if (document.fullscreenElement) {
      // fullscreen
      this.isFullScreen = true;
    } else {
      // not in full screen
      this.isFullScreen = false;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  displayControls(event: any) {
    this.controlOpacity = 1;
    if (this.controlTimeout) {
      clearTimeout(this.controlTimeout);
    }
    this.controlTimeout = setTimeout(() => {
      this.controlOpacity = 0;
    }, 5000);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'm':
        this.toggleMute();
        break;

      case ' ':
        this.togglePlaying();
        break;

      case 'f':
        this.openFullscreen();
    }
    console.log(event.key);
  }


  //play and pause button
  togglePlaying() {
    this.Playing ? this.api.pause() : this.api.resume();
    this.Playing = !this.Playing;
  }

  ngAfterViewInit(): void {
    //this.openDialog();
    const code_room: string = this.route.snapshot.queryParamMap.get('room');
    console.log(code_room);
    this.api.registerToRoom(code_room,this.elem)
    this.audioon = false;
  }

  //fullscreen button
  toggleFullscreen(){

    if(!this.isFullScreen){
      this.openFullscreen();
    }
    else{
      this.closeFullscreen();
    }
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
    if (this.elem.exitFullscreen) {
      this.elem.exitFullscreen();
    } else if (this.elem.webkitExitFullscreen) { /* Safari */
      this.elem.webkitExitFullscreen();
    } else if (this.elem.msExitFullscreen) { /* IE11 */
      this.elem.msExitFullscreen();
    }
    this.isFullScreen = !this,this.isFullScreen;
  }
}
