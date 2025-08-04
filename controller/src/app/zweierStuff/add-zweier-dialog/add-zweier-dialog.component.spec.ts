import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddZweierDialogComponent } from './add-zweier-dialog.component';

describe('AddZweierDialogComponent', () => {
  let component: AddZweierDialogComponent;
  let fixture: ComponentFixture<AddZweierDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddZweierDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddZweierDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
