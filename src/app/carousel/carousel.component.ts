import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  slides = [
    { src: "/assets/images/selection.svg", text: "Choose the movie to watch tonight with friends" },
    { src: "/assets/images/form.svg", text: "Fill in all fields in the form" },
    { src: "/assets/images/movie_night.svg", text: "Enjoy a movie with friends" },
    { src: "/assets/images/share_link.svg", text: "Send the link to your friends so they can access the room" }
  ];
  currentSlide = 0;
  source = interval(3000);

  constructor() { }

  ngOnInit(): void {
    // this.source.subscribe(val => this.onNextClick());
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    console.log("previous clicked, new current slide is: ", this.currentSlide);
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    console.log("next clicked, new current slide is: ", this.currentSlide);
  }

}
