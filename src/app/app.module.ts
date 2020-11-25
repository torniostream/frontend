import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { RoomDialogComponent, PlayerComponent } from './player/player.component';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './user-card/user-card.component';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';

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
    MatCardModule,
    CommonModule,
    MatInputModule,
    MatGridListModule,
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatExpansionModule,
    FormsModule,
    MatListModule,
    RouterModule.forRoot([
      {
        path: 'player',
        component: PlayerComponent,
      },
      {
        path: '**',
        component: WaitingroomComponent,
      }
    ]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]


})
export class AppModule { }
