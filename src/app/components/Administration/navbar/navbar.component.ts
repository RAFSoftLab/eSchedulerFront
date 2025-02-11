import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private authService: AuthService
  ) {}


  onLogout(): void {
    this.authService.logout();
  }
}
