import { Component, inject } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Einer } from '../models/einer.model';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-einer-gaeste',
  standalone: true,
  imports: [MatListModule, MatDividerModule, CommonModule, FormsModule],
  templateUrl: './einer-gaeste.component.html',
  styleUrl: './einer-gaeste.component.css'
})
export class EinerGaesteComponent {
  apiService = inject(ApiServiceService);
  einer?: Einer[];

  ngOnInit() {
    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 1000); // Refresh data every 5 seconds
  }

  loadData(){
    this.apiService.getAllEinerGuests().subscribe(data => {
      this.einer = data;
      console.log(data);
    });
  }

  private timeToMs(zeit: string, hasse:number): number {
    const [min, sec, ms] = zeit.split(':').map(Number);
    return (min * 60000) + (sec * 1000) + ms + (hasse * 1000); // Add hasse time in seconds converted to milliseconds
  }

  timeSort(data: Einer[]): Einer[] {
    return data.sort((a, b) => this.timeToMs(a.zeit, a.fehlerpunkte) - this.timeToMs(b.zeit, b.fehlerpunkte));
  }

  getFullTime(zeit: string, hasse: number): string {
    const [min, sec, ms] = zeit.split(':').map(Number);
    const totalMs = (min * 60000) + (sec * 1000) + ms + (hasse * 1000);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds}`;
  }
}
