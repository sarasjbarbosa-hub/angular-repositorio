import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

   usuario = {
    nome: '',
    senha: ''
   };


mensagemDeErro: string | null = null;

constructor(private auth: Auth, private router: Router) {}

login(usuario: { nome: string; senha: string }) {
  this.auth.login(usuario).subscribe({
    next: () => this.router.navigate(['/home']),
    error: (err: { error?: { message?: string } }) => {
      this.mensagemDeErro =
        err.error?.message ?? 'Ocorreu um erro ao tentar fazer login.';
}
});
}
}