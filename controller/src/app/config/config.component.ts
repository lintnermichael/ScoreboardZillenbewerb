import { Component, inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { ApiServiceService } from '../service/api-service.service';


@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {
  home_ff: string = '';
  apiService = inject(ApiServiceService);

  ngOnInit() {
    this.apiService.getConfig().subscribe({
      next: (config) => {
        this.home_ff = config.home_ff;
      },
      error: (error) => {
        console.error('Error fetching configuration:', error);
      }
    });
  }
  
  saveConfig() {
    this.apiService.updateConfig({ home_ff: this.home_ff }).subscribe({
      next: (response) => {
        console.log('Configuration saved successfully:', response);
      },
      error: (error) => {
        console.error('Error saving configuration:', error);
      }
    });
  }

  downloadResult(){
    this.apiService.getPdf().subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      }
    });
  }
}
