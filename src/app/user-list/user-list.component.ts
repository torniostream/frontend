import { Component, OnInit, Inject,Output, EventEmitter } from '@angular/core';
import {SharedService} from './../shared.service';
import {User} from './../models/user';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {

@Output() disableChange = new EventEmitter<User>();

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar, private sharedService: SharedService) {
  }

  ngOnInit(): void {
  }

  toggleMute(userId): void{
   this.sharedService.sendMuteEvent(userId);
  }

  close(){
    this.snackBar.dismiss();
  }
}
