import { Component, inject,OnInit,ChangeDetectionStrategy, OnDestroy  } from '@angular/core';
import { ApiServiceService } from '../../service/api-service.service';
import { Einer } from '../../models/einer.model';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import { EinerProfilComponent } from "../einer-profil/einer-profil.component";
import {MatButtonModule} from '@angular/material/button';
import { AddEinerDialogComponent } from '../add-einer-dialog/add-einer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataRefresherService } from '../../service/data-refresher.service';

@Component({
  selector: 'app-einer',
  standalone: true,
  imports: [CommonModule, EinerProfilComponent, MatDividerModule, MatButtonModule, MatButtonToggleModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './einer.component.html',
  styleUrls: ['./einer.component.css']
})
export class EinerComponent implements OnInit, OnDestroy  {
  apiService = inject(ApiServiceService);
  einer?: Einer[];
  readonly dialog = inject(MatDialog);

  intervalId: any;

  sortStyleControl = new FormControl("1");
  sortStyle: string = "2"; // Default sort style is time sort

  private sub!: Subscription;

  constructor(private refresher: DataRefresherService) {}

  ngOnInit() {
    this.loadData();

    this.sub = this.refresher.einerRefresh$.subscribe(() => {
      this.loadData();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEinerDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New Einer:', result);
        this.apiService.addEiner(result).subscribe(() => {
          this.loadData();
        });
      } 
    });
  }

  private timeToMs(zeit: string, hasse:number): number {
    const [min, sec, ms] = zeit.split(':').map(Number);
    return (min * 60000) + (sec * 1000) + ms + (hasse * 1000); // Add hasse time in seconds converted to milliseconds
  }

  timeSort(data: Einer[]): Einer[] {
    return data.sort((a, b) => this.timeToMs(a.zeit, a.fehlerpunkte) - this.timeToMs(b.zeit, b.fehlerpunkte));
  }

  startNummerSort(data: Einer[]): Einer[] {
    return data.sort((a, b) => Number.parseInt(a.startnummer) - Number.parseInt(b.startnummer));
  }

  onToggleChange(event: MatButtonToggleChange) {
    this.loadData();
  }

  loadData(){
    this.apiService.getAllEiner().subscribe(data => {
      if(this.sortStyle === '1') {
            this.timeSort(data);
          }
          else if(this.sortStyle === '2') {
            this.startNummerSort(data);
          }
        
        this.einer = data;
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}


