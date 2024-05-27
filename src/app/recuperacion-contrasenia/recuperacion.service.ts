import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecuperacionService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://159.54.134.179/Usuarios';

  actualizarContrasenia(correo: string,contrasenia: string): Observable<string> {
    const url = `${this.apiUrl}/Actualizar_Contrasenia?correo=${correo}&contrasenia=${contrasenia}`;
    return this.http.patch(url, {},{ responseType: 'text' });
  }
}
