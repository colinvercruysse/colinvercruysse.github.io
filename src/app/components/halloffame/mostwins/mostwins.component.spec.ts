import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostwinsComponent } from './mostwins.component';

describe('MostwinsComponent', () => {
  let component: MostwinsComponent;
  let fixture: ComponentFixture<MostwinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostwinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostwinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
