import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { fraccionamientos, controladores } from '../app/modelos/fraccionamientos';
import { sesion, sesions, usuarios } from '../app/modelos/usuarios'
import {  deudas, deuda, deudores, graficas, entradas } from "../app/modelos/deudas"
import { lotes } from '../app/modelos/propiedades';
import { inquilinos } from '../app/modelos/inquilinos';
import {formatDate } from '@angular/common';
import { Personas } from './cuenta/personas.model';
import { PersonasService } from './notificaciones/personas.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  sesion  = new sesion();
  baseUrl = `https://evaluacionesuas-001-site1.gtempurl.com/Fraccionamientos/Consultar_Fraccionamiento?id_administrador=`;
  baseUrl1 = `https://localhost:44397/api/Personas/Consultar_Persona?id_administrador=`;
  baseUrl2 = `https://localhost:44397/Propiedades/Consultar_Propiedades?id_administrador=`;
  date1: any;


  constructor(private http: HttpClient) {}

  fetchData(id_administrador: any): Observable<fraccionamientos[]> {
    return this.http.get<fraccionamientos[]>(this.baseUrl+id_administrador);
  }

  fetchDataHikvision(id_administrador: any): Observable<controladores[]> {
    return this.http.get<controladores[]>("https://localhost:44397/Hikvision/Consultar_Hikvision?id_fraccionamiento="+id_administrador);
  }

  fetchDataUsers(id_administrador: any): Observable<usuarios[]> {
    return this.http.get<usuarios[]>(this.baseUrl1+id_administrador);
  }

  fetchDataLastUser(id_administrador: any): Observable<usuarios[]> {
    return this.http.get<usuarios[]>("https://localhost:44397/api/Personas/Consultar_Ultima_Persona?id_fraccionamiento="+id_administrador);

  }

  fetchDataUserPropierty(id_propietario: any): Observable<usuarios[]> {
    return this.http.get<usuarios[]>("https://localhost:44397/api/Personas/Consultar_Personas_Por_Lote?id_persona="+id_propietario);

  }

  fetchDataPropiedades(id_administrador: any): Observable<lotes[]> {
    return this.http.get<lotes[]>(this.baseUrl2+id_administrador);
  }

  fetchDataPersonasFraccionamiento(id_fraccionamiento: any, id_administrador: any): Observable<usuarios[]> {
    return this.http.get<usuarios[]>(
      'https://localhost:44397/api/Personas/Consultar_Personas_Fraccionamiento?id_fraccionamiento='+id_fraccionamiento+
      '&id_administrador='+id_administrador);
  }

  fetchDataPersonasLote(id_lote: any): Observable<inquilinos[]> {
    return this.http.get<inquilinos[]>('https://localhost:44397/api/Usuario_lote/Consultar_inquilino?id_lote='+id_lote);
  }

  fetchDataDeudas(id_tesorero: any): Observable<deudas[]> {
    return this.http.get<deudas[]>('https://localhost:44397/api/Deudas/Consultar_Deuda?id_tesorero='+id_tesorero);
  }

  fetchDataDeudasExtra(id_tesorero: any): Observable<deudas[]> {
    return this.http.get<deudas[]>('https://localhost:44397/api/Deudas/Consultar_DeudaExtra?id_tesorero='+id_tesorero);
  }

  fetchDataDeudores(): Observable<deudores[]> {
    return this.http.get<deudores[]>('https://localhost:44397/api/Deudas_Usuario/Consultar_Deudores');
  }

  restringir_acceso(id_deuda: any): Observable<deudores[]> {
    return this.http.get<deudores[]>('https://localhost:44397/api/Deudas_Usuario/Restringir_acceso?id_deuda='+id_deuda);
  }

  consultarPersonaIndividual(id_usuario:number): Observable<Personas[]>{
    return this.http.get<Personas[]>(`https://localhost:44397/api/Personas/Consultar_PersonaIndividual?id_persona=${id_usuario}`);
  }

  consultarCorreo(id_persona:number): Observable<Personas[]>{
    return this.http.get<Personas[]>(`https://localhost:44397/api/Personas/Obtener_Correo_Persona?id_persona=${id_persona}`);
  }

  iniciar_sesion1(sesion: {username: string, password:string}):Observable<sesions[]>{
  let direccion = "https://localhost:44397/Sesion/Iniciar_Sesion?correo="+sesion.username+"&contrasenia="+sesion.password;
  return this.http.get<sesions[]>(direccion);
  }

  async numeroRegistrosTabla(id_fraccionamiento: number, tabla: string){
    let direccion = "https://localhost:44397/api/ControllerGlobal/Calcular_Registros?id_fraccionamiento="+id_fraccionamiento+"&tabla="+tabla;

    const response = await this.http.get(direccion).toPromise();
    return response as any; // Assuming the response is an object

  }


  consultarDeudasPorCobrar():Observable<graficas[]>{
    let direccion = `https://localhost:44397/api/Graficos/Consultar_DeudasPorCobrar?id_fraccionamiento=${this.obtener_usuario(1)}`;
    return this.http.get<graficas[]>(direccion);
  }

  consultarEntradas():Observable<entradas[]>{
    let direccion = `https://localhost:44397/api/Graficos/Consultar_Entradas`;
    return this.http.get<entradas[]>(direccion);
  }

  fecha(date: Date){
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

    obtener_usuario(op: number){
      var data = (JSON.parse(localStorage.getItem("data") || '{}'));
      if(op==1){
        return data.id_usuario;
      }
      else if(op==2){
        return data.correo;
      }else if(op==3){
        return data.id_fraccionamiento;

      }else if(op==4){
        return data.id_lote;
      }else if(op==5){
        return data.fraccionamiento;
      }
      else if(op==6){
        return data.id_tesorero;
      }
      else if(op==7){
        return data.tipo_usuario;
      }
    }




    obtener_graficas(op: number){
      var graficas = (JSON.parse(localStorage.getItem("graficas") || '{}'));
      if(op==1){
        return graficas.cuentas_cobrar;
      }
      else if(op==2){
        return graficas.sum_variables;
      }else if(op==3){
        return graficas.sum_novariables;
      }else if(op==4){
        return graficas.variables;
      }else if(op==5){
        return graficas.novariables;
      }
      else if(op==6){
        return graficas.por_variables;
      }
      else if(op==7){
        return graficas.por_novariables;
    }
    }


}

