import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule,MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
 


import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import { UserlistComponent } from './userlist/userlist.component';


@NgModule({
    declarations: [
      AppComponent,
      WaitingroomComponent,
      PlayerComponent,
      UserlistComponent,
    ],

    imports: [
      BrowserModule,
      MatInputModule,
      CommonModule,
      MatSliderModule,
      MatDialogModule,
      MatFormFieldModule,
      FlexLayoutModule,
      MatCardModule,
      MatGridListModule,
      MatButtonModule,
      MatSelectModule,
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
