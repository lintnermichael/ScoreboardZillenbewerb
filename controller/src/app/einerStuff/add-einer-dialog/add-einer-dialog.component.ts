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
  selector: 'app-add-einer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions, 
    MatDialogClose, 
    MatDialogTitle, 
    MatDialogContent
  ],
  templateUrl: './add-einer-dialog.component.html',
  styleUrl: './add-einer-dialog.component.css'
})
export class AddEinerDialogComponent {
readonly dialogRef = inject(MatDialogRef<AddEinerDialogComponent>);

  name = '';
  startnummer = 0;
  zeit = '00:00:000';
  fehlerpunkte = 0;
  feuerwehr = '';

  save() {
      this.dialogRef.close({
          name: this.name,
          startnummer: this.startnummer,
          zeit: this.zeit,
          fehlerpunkte: this.fehlerpunkte,
          feuerwehr: this.feuerwehr 
      });
  }
}
