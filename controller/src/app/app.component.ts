import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { EinerComponent } from "./einerStuff/einer/einer.component";
import { ZweierComponent } from './zweierStuff/zweier/zweier.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ConfigComponent } from "./config/config.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTabsModule, EinerComponent, ZweierComponent, MatToolbarModule, ConfigComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'controller';
}
