import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: [ './contact-list.component.css' ]

})
export class ContactListComponent{
  title = 'project';
  accounts = [
    {id: 1 ,name : 'Kriive', imgUrl : "../assets/img/manu.jpeg", access: 'oggi alle 18.10'},
    {id: 2 ,name : 'Mulaz1', imgUrl : "../assets/img/mulaz.jpg", access: 'ieri alle 12.30'},
    {id: 3 ,name : 'Kriive', imgUrl : "../assets/img/manu.jpeg", access: 'oggi alle 18.10'},
    {id: 4 ,name : 'Mulaz1', imgUrl : "../assets/img/mulaz.jpg", access: 'ieri alle 12.30'},
    {id: 5 ,name : 'Kriive', imgUrl : "../assets/img/manu.jpeg", access: 'oggi alle 18.10'},
    {id: 6 ,name : 'Mulaz1', imgUrl : "../assets/img/mulaz.jpg", access: 'ieri alle 12.30'},
  ]
}
