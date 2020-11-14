import { Component, OnInit } from '@angular/core';
import { UserlistComponent } from '../userlist/userlist.component';
import { ApiService } from '../services/api.service';
import { Router,ActivatedRoute } from '@angular/router';

export  class User {
  username: string;
  profilephotoid: number;
  image: string;
  status: boolean;
}


@Component({
  selector: 'app-waitingroom',
  templateUrl: 'waitingroom.component.html',
  styleUrls: ['waitingroom.component.css']
})
export class WaitingroomComponent implements OnInit {

  code: string;
  user = {} as User;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code');
    console.log(this.code);
  }

  isFieldInvalid(field: string) { 

  }

goToFilm(){
  this.router.navigateByUrl('/player?code=' + this.code);
}

goToCreateRoom(){
  //this.router.navigateByUrl('/create');
}

}


