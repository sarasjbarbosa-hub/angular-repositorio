import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { VeiculosAPI } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class Vehicle {
  
  private apiURL = "http://localhost:3001";

  constructor(private http:HttpClient){}

  getVeiculos(): Observable<VeiculosAPI>{
    return this.http.get<VeiculosAPI>(`${this.apiURL}/vehicles`)
  }
}
