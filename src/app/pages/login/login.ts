import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

constructor(private router: Router) {}

login(usuario: { nome: string; senha: string }) {
  if (!usuario.nome.trim() || !usuario.senha.trim()) {
    this.mensagemDeErro = 'Preencha usuário e senha para continuar.';
    return;
  }

  sessionStorage.setItem('auth-user', JSON.stringify(usuario));
  this.router.navigate(['/home']);
}
}