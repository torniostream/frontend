import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnInit,
  AfterViewChecked,
  Inject,
  HostListener,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class PlayerComponent implements OnInit, AfterViewChecked {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

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

  title = 'Banning and friends';
  subtitle = 'Io sono leggenda';

  @ViewChild('videoRef') divView: ElementRef;
  

  @Output() playEvent = new EventEmitter<boolean>();
  @Output() video = new EventEmitter<ElementRef>();
  @Output() seekEvent = new EventEmitter<number>();

  controlOpacity = 1;
  controlTimeout: any;

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event) {
    this.chkScreenMode();
  }

  muted() {
    this.divView.nativeElement.muted = true;
    this.audioon = false;
  }

  noMuted() {
    this.divView.nativeElement.muted = false;
    this.audioon = true;
  }

  ngOnInit(): void {
    this.chkScreenMode();
    this.elem = document.documentElement;
    this.video.emit(this.divView);
  }

  ngAfterViewChecked(): void {
    this.video.emit(this.divView);
  }

  toggleMute() {
    this.divView.nativeElement.muted = !this.divView.nativeElement.muted;
    this.audioon = !this.divView.nativeElement.muted;
  }

  VolumeChange(volume) {
    this.divView.nativeElement.volume = volume.value;

    if (volume.value <= 0.0) {
      this.muted();
    } else {
      // se il volume e' minore della meta' usa icona volume-low altrimenti volume-high
      this.noMuted();
      if (volume.value <= 0.5) {
        this.audiolow = true;
      } else {
        this.audiolow = false;
      }
    }
  }

  activePip() {
    if (this.elem.pictureInPictureEnabled) {
      this.elem.requestPictureInPicture();
    }
  }
 
  onSeek(event) {
    const value = event.value;
    console.log(value);
    this.seekEvent.emit(value);
    
  }

  seekRelative(sec: number) {
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
    this.Playing = !this.Playing;
    this.playEvent.emit(this.Playing);
  }

  // Fullscreen button
  toggleFullscreen() {
    if (!this.isFullScreen) {
      this.openFullscreen();
    } else {
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

  notification(){

  }
}
