import {ChangeDetectionStrategy, Component, signal, Input, OnChanges, SimpleChanges, inject, EventEmitter, Output } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { ApiServiceService } from '../../service/api-service.service';
import {MatButtonModule} from '@angular/material/button';
import { DataRefresherService } from '../../service/data-refresher.service';
import { Zweier } from '../../models/zweier.model';

@Component({
  selector: 'app-zweier-profil',
  standalone: true,
  imports: [MatExpansionModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './zweier-profil.component.html',
  styleUrl: './zweier-profil.component.css'
})
export class ZweierProfilComponent {
  readonly panelOpenState = signal(false);
  @Input() profil!: Zweier;
  @Output() profilChange = new EventEmitter<Zweier>();
  fullTime!: string; 

  apiService = inject(ApiServiceService);
  pattern: RegExp = /^\d{2}:\d{2}:\d{3}$/;

  constructor(private refresher: DataRefresherService) {}
  
  ngOnChanges(changes: SimpleChanges) {
    this.fullTime = millisecondsToTime(timeToMilliseconds(this.profil.zeit), this.profil.fehlerpunkte);
  }

  saveChanges() {
    if (this.pattern.test(this.profil.zeit)) {
      this.apiService.updateZweier(this.profil).subscribe({
        next: (response) => {
          console.log('Profil updated successfully:', response);
          this.profilChange.emit(this.profil);
           this.refresher.triggerRefreshZweier();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    } else {
      console.error('Invalid time format. Please use MM:SS:SSS');
      alert('Ungültiges Zeitformat. Bitte verwenden Sie MM:SS:SSS');
    }
  }
}

function timeToMilliseconds(time: string): number {
  const [min, sec, ms] = time.split(':').map(Number);
  return min * 60000 + sec * 1000 + ms;
}

function millisecondsToTime(ms: number, hasse: number): string {
  ms = ms + (hasse * 1000); // Add the hasse time in seconds converted to milliseconds
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  // Pad numbers with zeros if needed
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  const msStr = String(milliseconds).padStart(3, '0');

  return `${minStr}:${secStr}:${msStr}`;
}
