import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZweierHomeComponent } from './zweier-home.component';

describe('EinerHomeComponent', () => {
  let component: ZweierHomeComponent;
  let fixture: ComponentFixture<ZweierHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZweierHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZweierHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
