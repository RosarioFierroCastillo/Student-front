import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificaciones } from '../modelos/notificaciones';
import { Observable } from 'rxjs';
import { Personas } from '../modelos/personas';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {



  private apiUrl = 'http://159.54.141.160/Notificaciones2/'; // URL base de la API

  constructor(private http: HttpClient) {}

  agregarNotificacion(idFraccionamiento: number, tipo: string, idDestinatario: number, asunto: string, mensaje: string) {
    const url = `${this.apiUrl}Agregar_Notificacion?id_fraccionamiento=${idFraccionamiento}&tipo=${tipo}&id_destinatario=${idDestinatario}&asunto=${asunto}&mensaje=${mensaje}`;
    return this.http.post(url, {}, { responseType: 'text' });
  }

  consultarNotificacionPorId(idFraccionamiento: number) {
    const url = `${this.apiUrl}Consultar_Notificacion?id_fraccionamiento=${idFraccionamiento}`;
    return this.http.get<Notificaciones[]>(url);
  }

  consultarNotificacion(idFraccionamiento: number, id_destinatario: number): Observable<Notificaciones[]> {
    const url = `${this.apiUrl}Consultar_Notificaciones?id_fraccionamiento=${idFraccionamiento}&id_destinatario=${id_destinatario}`;
    //console.log("HOLAAAAA")
    return this.http.get<Notificaciones[]>(url);
  }

  consultarNotificacionesPorId(idFraccionamiento: number, idDestinatario: number): Observable<Notificaciones[]> {
    const url = `${this.apiUrl}consultar_Notificacion?id_fraccionamiento=${idFraccionamiento}`;
    return this.http.get<Notificaciones[]>(url);
  }



}
