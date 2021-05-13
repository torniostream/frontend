import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { Error } from '../models/error';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: Error,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

}
