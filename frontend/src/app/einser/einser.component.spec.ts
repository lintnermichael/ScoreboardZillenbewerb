import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinserComponent } from './einser.component';

describe('EinserComponent', () => {
  let component: EinserComponent;
  let fixture: ComponentFixture<EinserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
