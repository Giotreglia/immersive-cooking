import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { Title } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  constructor(private route: Router, private backend: BackendService, private http: HttpClient, private auth: AuthService, private router: Router, private token: TokenService) {}

  errorShow: boolean = false;
  error: any = 'Email o password errate';


  ngOnInit(): void {
  }

  public form = {
    username: null,
    password: null
  }

  sessione_max_time = 7200; // 2 hours - in seconds
  sessione_interval = 60;

  submitLogin() {
    console.log(this.form);
    this.backend.login(this.form).pipe(
      catchError(error => {
      // Gestisci l'errore qui, ad esempio mostrando un messaggio all'utente o registrandolo nei log
      console.error('Si è verificato un errore:', error);
      console.log(error)
      this.errorShow = true;
      setTimeout(() => {
        this.errorShow = false;
      }, 5000);
      return throwError(error);
    })).subscribe((resp: any) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp));
      localStorage.setItem('token', JSON.stringify(resp.session_id));
      localStorage.setItem('expireTime', resp.session_expire);
      let countdown = setInterval(() => {
        let remainingTime;
        remainingTime = this.sessione_max_time - this.sessione_interval;
        this.sessione_max_time = this.sessione_max_time - this.sessione_interval;
        console.log('La tua sessione scadrà tra ' + this.sessione_max_time + ' secondi');
      }, 60000)
      setTimeout(() => {
        this.logout();
        window.location.reload();
        clearInterval(countdown);
        alert('La tua sessione è scaduta, effettua nuovamente l\'accesso alla piattaforma.')
      }, this.sessione_max_time * 1000)
      this.route.navigate(['dashboard/home']);
    })
  }

  logout() {
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigateByUrl('login');
  }

  handleError(error: any) {
    this.error = error.error.error;
  }

  handleResponse(data: any) {
    console.log(data.access_token);
  }
}
