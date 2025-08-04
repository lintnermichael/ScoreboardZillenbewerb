import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinerComponent } from './einer.component';

describe('EinerComponent', () => {
  let component: EinerComponent;
  let fixture: ComponentFixture<EinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
