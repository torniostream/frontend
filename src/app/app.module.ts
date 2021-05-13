import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { WaitingroomComponent } from './waitingroom/waitingroom.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { AvatarComponent } from './avatar/avatar.component';
import {MatMenuModule} from '@angular/material/menu';
import { AdminComponent } from './admin/admin.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationComponent } from './notification/notification.component'; 
import {MatToolbarModule} from '@angular/material/toolbar';
import { CarouselComponent } from './carousel/carousel.component';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { UserListComponent } from './user-list/user-list.component'; 
 
@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    WaitingroomComponent,
    AvatarComponent,
    AdminComponent,
    NotificationComponent,
    CarouselComponent,
    UserListComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    CommonModule,
    ClipboardModule,
    MatInputModule,
    MatStepperModule,
    MatGridListModule,
    MatSliderModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FlexLayoutModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    RouterModule.forRoot([
    {
        path: '**',
        component: WaitingroomComponent,
    }
], { relativeLinkResolution: 'legacy' }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]


})
export class AppModule { }
