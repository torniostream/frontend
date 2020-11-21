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

export interface DialogData {
  room: string;
}

@Component({
  selector: 'app-room-dialog',
  templateUrl: 'room.dialog.html',
  styleUrls: ['./player.component.css'],
})
export class RoomDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.greet = this.getGreeting();
  }

  greets = ['Ciao!', 'Hey!', 'Salve!', 'Ehi, come va?'];
  greet: string;

  onNoClick(): void {
    this.dialogRef.close();
  }
  getGreeting(): string {
    return this.greets[Math.floor(Math.random() * this.greets.length)];
  }
}

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
  ) { }
  Playing = false;

  elem: any;
  isFullScreen = false;

  width = 0;

  position = 0;
  duration = 0;

  audioon = false;
  audiolow = false;

  timeLeft = '00:00';
  durationTot = '00:00';

  temp = 0;

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

  openDialog(): void {
    const dialogRef = this.dialog.open(RoomDialogComponent, {
      width: '40rem',
      height: '20rem',
      data: { room: this.roomId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === ''){
        console.log('Error: Insert code room again');
      }
      this.api.registerToRoom(result, this.divView.nativeElement);
      this.audioon = !this.divView.nativeElement.muted;
    });
  }

  muted(){
    this.divView.nativeElement.muted;
    this.audioon = false;
  }

  noMuted(){
    this.divView.nativeElement.muted = false;
    this.audioon = true;
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
      let totalSeconds = 0;
      totalSeconds = totalSeconds + pos / 1000;

      const time = new Date(null);
      time.setSeconds(totalSeconds);
      let hours = null;

      if (totalSeconds >= 3600) {
        hours = time.getHours().toString().padStart(2, '0');
      }

      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');

      this.timeLeft = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    });
    this.api.getVideoDuration().subscribe((dur) => {
      if (dur <= 0) { console.log('Negative duration!'); }
      this.duration = dur;
      const temp = dur / 1000;

      const duration = new Date(null);
      duration.setSeconds(temp);
      let hours_tot = null;

      if (temp >= 3600) {
        hours_tot = duration.getHours().toString().padStart(2, '0');
      }

      const minutes_tot = duration.getMinutes().toString().padStart(2, '0');
      const seconds_tot = duration.getSeconds().toString().padStart(2, '0');

      this.durationTot = `${hours_tot ? hours_tot : '00'}:${minutes_tot}:${seconds_tot}`;

    });
    this.api.getIsPlaying().subscribe((play) => (this.Playing = play));
  }

  toggleMute() {
    this.divView.nativeElement.muted = !this.divView.nativeElement.muted;
    this.audioon = !this.divView.nativeElement.muted;
  }


  VolumeChange(volume) {
    this.divView.nativeElement.volume = volume.value;

    if (volume.value <= 0.0) { this.muted(); }
    else{                 // se il volume e' minore della meta' usa icona volume-low altrimenti volume-high
          this.noMuted();
          if (volume.value <= 0.5) { this.audiolow = true; }
          else { this.audiolow = false; }
    }
  }

  activePip() {
    if (this.divView.nativeElement.pictureInPictureEnabled) {
            this.divView.nativeElement.requestPictureInPicture();
    }
  }

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
        this.toggleFullscreen();
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

  // Fullscreen button
  toggleFullscreen() {
    if (!this.isFullScreen) {
      this.openFullscreen();
    }
    else {
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
    } else {
      return;
    }
    this.isFullScreen = true;
  }

  closeFullscreen() {
    if (!this.document.exitFullscreen) {
      return; // Fullscreen WebAPI not found
    }

    this.document.exitFullscreen();
    this.isFullScreen = false;
  }
}
