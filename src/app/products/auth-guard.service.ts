// route guard implementation for Products page
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) { }

  // Products page will be displayed only if user logs in
  canActivate() {
    if (this.loginService.username != '') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
