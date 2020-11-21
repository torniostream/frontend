import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingroomComponent } from './waitingroom.component';

describe('WaitingroomComponent', () => {
  let component: WaitingroomComponent;
  let fixture: ComponentFixture<WaitingroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitingroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
