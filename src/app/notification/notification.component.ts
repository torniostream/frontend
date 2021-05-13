import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Notification,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

}
