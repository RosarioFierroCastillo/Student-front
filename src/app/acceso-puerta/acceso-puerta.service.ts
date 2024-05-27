import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesoPuertaService {

  constructor(private http: HttpClient) {}

  //http://159.54.134.179/Usuarios/Generar_Token
  //http://159.54.134.179/Usuarios/Consultar_Correo?id_persona=${userId}
  getToken(): Observable<string> {
    const url = `http://159.54.134.179/api/Whatsapp/Generar_Token`;
    // Indicamos al HttpClient que esperamos un texto en la respuesta
    return this.http.get(url, { responseType: 'text' });
  }


}
