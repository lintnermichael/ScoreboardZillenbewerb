import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZweierComponent } from './zweier.component';

describe('ZweierComponent', () => {
  let component: ZweierComponent;
  let fixture: ComponentFixture<ZweierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZweierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZweierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
