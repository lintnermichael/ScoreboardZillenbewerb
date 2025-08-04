import { Component, inject } from '@angular/core';
import { MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle, } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-zweier-dialog',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions, 
    MatDialogClose, 
    MatDialogTitle, 
    MatDialogContent],
  templateUrl: './add-zweier-dialog.component.html',
  styleUrl: './add-zweier-dialog.component.css'
})
export class AddZweierDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddZweierDialogComponent>);

  name1 = '';
  name2 = '';
  startnummer = 0;
  zeit = '00:00:000';
  fehlerpunkte = 0;
  feuerwehr = '';

  save() {

    this.dialogRef.close({
      name1: this.name1,
      name2: this.name2,
      startnummer: this.startnummer,
      zeit: this.zeit,
      fehlerpunkte: this.fehlerpunkte,
      feuerwehr: this.feuerwehr
    });
  }
}
