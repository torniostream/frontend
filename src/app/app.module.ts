import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { RoomDialogComponent, PlayerComponent } from './player/player.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './user-card/user-card.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    RoomDialogComponent,
    UserCardComponent,
    WaitingroomComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MatInputModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule.forRoot([
    {
        path: 'player',
        component: PlayerComponent,
    },
    {
        path: '**',
        component: PlayerComponent,
    }
], { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]


})
export class AppModule { }
