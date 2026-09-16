import { Component, OnInit } from '@angular/core';
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
export class Dashboard implements OnInit {
  veiculos: Veiculo[]= [];
  veiculoSelecionado: Veiculo | null= null;

  private readonly detalhesPorVeiculo: Record<string, {
    imagem: string;
    vin: string;
    odometro: string;
    combustivel: string;
    status: string;
    latitude: string;
    longitude: string;
  }> = {
    ranger: {
      imagem: '/img/ranger.png',
      vin: '2FMPK4K92LBA17483',
      odometro: '10000 Km',
      combustivel: '25 %',
      status: 'off',
      latitude: '-12,2322',
      longitude: '-35,2314'
    },
    mustang: {
      imagem: '/img/mustang.png',
      vin: '2FMDK3AK2FBB023455',
      odometro: '50000 Km',
      combustivel: '90 %',
      status: 'on',
      latitude: '-12,2322',
      longitude: '-35,2314'
    },
    territory: {
      imagem: '/img/territory.png',
      vin: '2FMAK4K92LBA17483',
      odometro: '10000 Km',
      combustivel: '25 %',
      status: 'off',
      latitude: '-12,2322',
      longitude: '-35,2314'
    },
    broncosport: {
      imagem: '/img/broncoSport.png',
      vin: '3FMCR9B60MRA12345',
      odometro: '25000 Km',
      combustivel: '70 %',
      status: 'on',
      latitude: '-12,2322',
      longitude: '-35,2314'
    }
  };

  constructor(private vehicle: Vehicle) {}

  ngOnInit(): void {
    this.vehicle.getVeiculos().subscribe({
      next: (response) => {
        this.veiculos = response.vehicles;
        this.veiculoSelecionado = this.veiculos[0] ?? null;
      }
    });
  }

  veiculoEscolhido(event: Event): void {
    const idSelecionado = (event.target as HTMLSelectElement).value;

    if (idSelecionado) {
      this.veiculoSelecionado = this.veiculos.find((v) => String(v.id) === idSelecionado) ?? null;
    } else {
      this.veiculoSelecionado = null;
    }
  }

  get detalhesSelecionados() {
    const chave = this.veiculoSelecionado?.vehicle
      .toLowerCase()
      .replace(/\s+/g, '');

    return this.detalhesPorVeiculo[chave] ?? null;
  }
}