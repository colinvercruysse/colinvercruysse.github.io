import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastgameComponent } from './lastgame.component';

describe('LastgameComponent', () => {
  let component: LastgameComponent;
  let fixture: ComponentFixture<LastgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastgameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
