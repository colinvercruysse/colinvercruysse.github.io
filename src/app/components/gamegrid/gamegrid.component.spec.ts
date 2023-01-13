import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamegridComponent } from './gamegrid.component';

describe('GamegridComponent', () => {
  let component: GamegridComponent;
  let fixture: ComponentFixture<GamegridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamegridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
