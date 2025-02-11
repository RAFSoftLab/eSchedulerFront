import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private usersService: UsersService,
    private oauthService: OAuthService,
    private router: Router,
    private authService: AuthService
  ) {}



  loginWithGoogle() {
    this.oauthService.initLoginFlow();

    this.oauthService.tryLoginImplicitFlow().then(() => {
      this.handleLoginSuccess();
    });
  }

  private handleLoginSuccess() {
    const idToken = this.oauthService.getIdToken();

    if (!idToken) {
      console.error('Greška: Nema validnog ID tokena.');
      this.router.navigate(['/login']);
      return;
    }
    this.usersService.authenticateUser(idToken).subscribe({
      next: (response: any) => {
        if (response.token) {
          this.authService.setToken(response.token);

          this.redirectBasedOnRole();
        } else {
          console.log("Ne postoji token: " , response.token)
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Greška pri komunikaciji sa backendom', error);
        this.router.navigate(['/login']);
      },
    });
  }

  private redirectBasedOnRole() {
    // console.log("redirektuje")
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/standardUser']);
    }
  }
}
