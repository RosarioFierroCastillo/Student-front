import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Deudores } from './deudores.model';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  constructor(private http:HttpClient) { }


  private apiUrl = 'https://localhost:44397/api/Deudas';

  consultarDeudoresOridinarios(idFraccionamiento: number,idUsuario:number): Observable<Deudores[]> {
    const url = `${this.apiUrl}/Consultar_DeudoresOrdinarios?id_fraccionamiento=${idFraccionamiento}&id_usuario=${idUsuario}`;
    
    return this.http.get<Deudores[]>(url);
  }

  consultarDeudoresExtraoridinarios(idFraccionamiento: number,idUsuario:number): Observable<Deudores[]> {
    const url = `${this.apiUrl}/Consultar_DeudorExtraordinario?id_fraccionamiento=${idFraccionamiento}&id_usuario=${idUsuario}`;
    
    return this.http.get<Deudores[]>(url);
  }

  pagarDeudaOrdinaria(idDeudor: number, idDeuda: number, idFraccionamiento: number, proximoPago: string): Observable<boolean> {
    const url = `${this.apiUrl}/Pagar_DeudaOrdinaria?id_deudor=${idDeudor}&id_deuda=${idDeuda}&id_fraccionamiento=${idFraccionamiento}&proximo_pago=${proximoPago}`;

    return this.http.post<boolean>(url, {});
  }

  pagarDeudaExtraordinaria(idDeudor: number, idDeuda: number, idFraccionamiento: number, proximoPago: string): Observable<boolean> {
    const url = `${this.apiUrl}/Pagar_DeudaExtraordinaria?id_deudor=${idDeudor}&id_deuda=${idDeuda}&id_fraccionamiento=${idFraccionamiento}&proximo_pago=${proximoPago}`;

    return this.http.post<boolean>(url, {});
  }


}
