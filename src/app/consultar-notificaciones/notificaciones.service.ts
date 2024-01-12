import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificaciones } from './notificaciones.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  

  private apiUrl = 'https://localhost:44397/Notificaciones/'; // URL base de la API

  constructor(private http: HttpClient) {}


  consultarNotificacionPorId(idFraccionamiento: number) {
    const url = `${this.apiUrl}Consultar_Notificacion?id_fraccionamiento=${idFraccionamiento}`;
    return this.http.get<Notificaciones[]>(url);
  }

  consultarNotificacion(idFraccionamiento: number): Observable<Notificaciones[]> {
    const url = `${this.apiUrl}Consultar_Notificaciones?id_fraccionamiento=${idFraccionamiento}`;
    console.log("HOLAAAAA")
    return this.http.get<Notificaciones[]>(url);
  }

  consultarNotificacionesPorId(idFraccionamiento: number, idDestinatario: number): Observable<Notificaciones[]> {
    const url = `${this.apiUrl}consultar_Notificacion?id_fraccionamiento=${idFraccionamiento}`;
    return this.http.get<Notificaciones[]>(url);
  }

  
}
