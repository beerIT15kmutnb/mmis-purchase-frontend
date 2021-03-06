import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import * as _ from 'lodash';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  public token: string;
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router) { }

  canActivate() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const accessRight = decodedToken.accessRight;

      if (accessRight) {
        if (this.jwtHelper.isTokenExpired(token)) {
          this.router.navigate(['login']);
          return false;
        } else {
          const rights = accessRight.split(',');
          let isAdmin = false;
          if (_.indexOf(rights, 'PO_ADMIN') > -1) {
            isAdmin = true;
          } else {
            isAdmin = false;
          }

          if (!isAdmin) {
            this.router.navigate(['login']);
            return false;
          } else {
            return true;
          }
        }

      } else {
        this.router.navigate(['login']);
        return false;
      }

    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
