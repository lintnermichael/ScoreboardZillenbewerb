import { Component, inject,OnInit,ChangeDetectionStrategy, OnDestroy  } from '@angular/core';
import { ApiServiceService } from '../../service/api-service.service';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataRefresherService } from '../../service/data-refresher.service';
import { ZweierProfilComponent } from '../zweier-profil/zweier-profil.component';
import { Zweier } from '../../models/zweier.model';
import { AddZweierDialogComponent } from '../add-zweier-dialog/add-zweier-dialog.component';

@Component({
  selector: 'app-zweier',
  standalone: true,
  imports: [CommonModule, ZweierProfilComponent, MatDividerModule, MatButtonModule, MatButtonToggleModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './zweier.component.html',
  styleUrl: './zweier.component.css'
})
export class ZweierComponent {
apiService = inject(ApiServiceService);
  zweier?: Zweier[];
  readonly dialog = inject(MatDialog);

    sortStyleControl = new FormControl("1");
    sortStyle: string = "2"; // Default sort style is time sort

  private sub!: Subscription;
  constructor(private refresher: DataRefresherService) {}

  ngOnInit() {
    this.loadData();

    this.sub = this.refresher.zweierRefresh$.subscribe(() => {
      this.loadData();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddZweierDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Save the new Einer (result contains name, startnummer, zeit)
        console.log('New Zweier:', result);
        this.apiService.addZweier(result).subscribe(() => {
          this.loadData();
      });
    }}
    );
  }

  private timeToMs(zeit: string, hasse:number): number {
    const [min, sec, ms] = zeit.split(':').map(Number);
    return (min * 60000) + (sec * 1000) + ms + (hasse * 1000); // Add hasse time in seconds converted to milliseconds
  }

  timeSort(data: Zweier[]): Zweier[] {
      return data.sort((a, b) => this.timeToMs(a.zeit, a.fehlerpunkte) - this.timeToMs(b.zeit, b.fehlerpunkte));
    }
  
    startNummerSort(data: Zweier[]): Zweier[] {
      return data.sort((a, b) => Number.parseInt(a.startnummer) - Number.parseInt(b.startnummer));
    }
  
    onToggleChange(event: MatButtonToggleChange) {
      this.loadData();
    }
  
    loadData(){
      this.apiService.getAllZweier().subscribe(data => {
        if(this.sortStyle === '1') {
              this.timeSort(data);
            }
            else if(this.sortStyle === '2') {
              this.startNummerSort(data);
            }
          
          this.zweier = data;
        });
    }
}
