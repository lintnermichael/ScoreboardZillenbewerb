import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZweierProfilComponent } from './zweier-profil.component';

describe('ZweierProfilComponent', () => {
  let component: ZweierProfilComponent;
  let fixture: ComponentFixture<ZweierProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZweierProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZweierProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
