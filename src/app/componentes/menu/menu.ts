import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

  menuAberto = false;

  constructor(private auth: Auth) {}

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.auth.logout();
  }
}
