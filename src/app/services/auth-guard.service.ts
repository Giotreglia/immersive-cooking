import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  canActivate(): 
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree {
    if (!this.token.isLogged()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }

  constructor(private token: TokenService, private router: Router) { }
}
