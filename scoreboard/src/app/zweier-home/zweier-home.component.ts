import { Component, inject } from '@angular/core';
import { ApiServiceService } from '../service/api-service.service';
import { Einer } from '../models/einer.model';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Zweier } from '../models/zweier.model';

@Component({
  selector: 'app-zweier-home',
  standalone: true,
  imports: [MatListModule, MatDividerModule, CommonModule, FormsModule],
  templateUrl: './zweier-home.component.html',
  styleUrl: './zweier-home.component.css'
})
export class ZweierHomeComponent {
  apiService = inject(ApiServiceService);
  zweier?: Zweier[];

  ngOnInit() {
    this.loadData();

    setInterval(() => {
      this.loadData();
    }, 1000);
  }

  loadData(){
    this.apiService.getAllZweierrHome().subscribe(data => {
      this.zweier = data;
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
