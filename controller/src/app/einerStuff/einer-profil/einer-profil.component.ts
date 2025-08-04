import {ChangeDetectionStrategy, Component, signal, Input, OnChanges, SimpleChanges, inject, EventEmitter, Output } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Einer } from '../../models/einer.model';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { ApiServiceService } from '../../service/api-service.service';
import {MatButtonModule} from '@angular/material/button';
import { DataRefresherService } from '../../service/data-refresher.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-einer-profil',
  standalone: true,
  imports: [MatExpansionModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './einer-profil.component.html',
  styleUrl: './einer-profil.component.css'
})
export class EinerProfilComponent {
  readonly panelOpenState = signal(false);
  @Input() profil!: Einer;
  @Output() profilChange = new EventEmitter<Einer>();
  @Input() id!: number;
  fullTime!: string; 
  disqualiviziert: boolean = false;

  apiService = inject(ApiServiceService);
  pattern: RegExp = /^\d{2}:\d{2}:\d{3}$/;

  constructor(private refresher: DataRefresherService) {}
  
  ngOnChanges(changes: SimpleChanges) {
    this.fullTime = millisecondsToTime(timeToMilliseconds(this.profil.zeit), this.profil.fehlerpunkte);
    this.profil.disqualiviziert = isDisqualiviziertString(this.disqualiviziert);
    console.log(typeof this.profil.disqualiviziert);
  }

  saveChanges() {
    if (this.pattern.test(this.profil.zeit)) {
      //this.profil.disqualiviziert = this.disqualiviziert;
      this.apiService.updateEiner(this.profil).subscribe({
        next: (response) => {
          console.log('Profil updated successfully:', response);
          this.profilChange.emit(this.profil);
           this.refresher.triggerRefreshEiner();
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

function isDisqualiviziert(value: string): boolean {
  return value.toLowerCase() === 'true';
}

function isDisqualiviziertString(value: boolean): string {
  return value ? 'true' : 'false';
}
