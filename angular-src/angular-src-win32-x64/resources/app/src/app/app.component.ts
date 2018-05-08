import { Component, HostListener } from "@angular/core";
import { IngresarService } from "./services/ingresar.service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [IngresarService]
})

export class AppComponent {
  @HostListener("window:onbeforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.removeItem('dni');
    localStorage.removeItem('nombre');
    localStorage.removeItem('privilegio');
  }
}
