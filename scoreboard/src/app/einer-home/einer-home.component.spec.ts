import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinerHomeComponent } from './einer-home.component';

describe('EinerHomeComponent', () => {
  let component: EinerHomeComponent;
  let fixture: ComponentFixture<EinerHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinerHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
