import { Component } from '@angular/core';
import { Menu } from "../../componentes/menu/menu";
import { Vehicle } from '../../services/vehicle';
import { Veiculo } from '../../models/veiculo.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [Menu, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  veiculos: Veiculo[]= [];
  veiculoSelecionado: Veiculo | null= null;
  
  constructor(private vehicle:Vehicle){}

  veiculoEscolhido(event: Event): void {
    const idSelecionado = (event.target as HTMLSelectElement).value;

    if (idSelecionado) {
      this.veiculoSelecionado = this.veiculos.find(v=>v.id == Number(idSelecionado)) || null;
  }
  else {
    this.veiculoSelecionado = null;
  }
}
}