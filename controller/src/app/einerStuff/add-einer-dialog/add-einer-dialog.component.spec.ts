import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEinerDialogComponent } from './add-einer-dialog.component';

describe('AddEinerDialogComponent', () => {
  let component: AddEinerDialogComponent;
  let fixture: ComponentFixture<AddEinerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEinerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEinerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
