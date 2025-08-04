import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import { EinerHomeComponent } from "./einer-home/einer-home.component";
import { EinerGaesteComponent } from "./einer-gaeste/einer-gaeste.component";
import { ZweierHomeComponent } from "./zweier-home/zweier-home.component";
import { ZweierGaesteComponent } from "./zweier-gaeste/zweier-gaeste.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatGridListModule, EinerHomeComponent, EinerGaesteComponent, ZweierHomeComponent, ZweierGaesteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'scoreboard';
}
