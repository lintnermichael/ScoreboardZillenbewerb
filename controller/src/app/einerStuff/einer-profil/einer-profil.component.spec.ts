import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinerProfilComponent } from './einer-profil.component';

describe('EinerProfilComponent', () => {
  let component: EinerProfilComponent;
  let fixture: ComponentFixture<EinerProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EinerProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EinerProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
