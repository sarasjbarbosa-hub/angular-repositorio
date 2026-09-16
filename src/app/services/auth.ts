import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})

export class Auth {

  private apiUrl = "http://localhost:3001";

  constructor(private http: HttpClient, private router: Router){}

  login(usuario:Pick<Usuario, 'nome' | 'senha'>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuario).pipe(
      tap(( response => {
        sessionStorage.setItem(USER_KEY, JSON.stringify(response));
      }))
    );
  }

  logout(): void {
    sessionStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }

  estadoLogado (): boolean {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? true : false;
  }
}
