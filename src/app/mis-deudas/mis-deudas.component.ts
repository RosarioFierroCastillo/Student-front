import { Component } from '@angular/core';
import { Deudores } from '../ingresos-extraordinarios/deudores.model';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { FormBuilder } from '@angular/forms';
import { PersonasService } from '../ingresos-extraordinarios/personas.service';
import {  deudores, deudor } from "../modelos/deudas"
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mis-deudas',
  templateUrl: './mis-deudas.component.html',
  styleUrls: ['./mis-deudas.component.css']
})
export class MisDeudasComponent {

  httpclient: any;
  deudores: deudores[] = [];
  deudor =new deudor();
  filtroDeudores:'' | undefined;

  Deudores_totales:Deudores[]=[];
  Deudores_totales2:Deudores[]=[];
  ngOnInit(){
    //this.fetchDataDeudores();
    this.ConsultarDeudores();
  }

  constructor(private http: HttpClient, private dataService: DataService, private fb: FormBuilder,private personasService:PersonasService){}

  // fetchDataDeudores() {
  //   this.dataService.fetchDataDeudores(this.dataService.obtener_usuario(3)).subscribe((deudores: deudores[]) => {
  //     console.log(deudores);
  //     this.deudores = deudores;
  //   });
  // }

  ConsultarDeudores(){
    console.log("aaaaaaaa: " + this.dataService.obtener_usuario(4))
    this.personasService.consultarDeudoresUsuarios(this.dataService.obtener_usuario(1)).subscribe(
      (deudasUsuario: Deudores[]) => {
       this.Deudores_totales = deudasUsuario
        console.log('deudas', this.Deudores_totales);
        if(this.Deudores_totales.length!=0){

        }else{
          Swal.fire({
            title: 'El usuario no tiene deudas  vencidas',
            text: '',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }

      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
      }
    );
  }

  calcularDiasRetraso(proximoPago: string,periodicidad:number): number {

    const fechaProximoPago = new Date(proximoPago);
    const hoy = new Date();
    const diferenciaTiempo = hoy.getTime() - fechaProximoPago.getTime();
    const diasRetraso = Math.floor(diferenciaTiempo / (1000 * 3600 * 24)); // Calcula los días de diferencia

     // Sumar la periodicidad en días


    return Math.max(0, diasRetraso); // Devuelve al menos cero si la fecha ya ha pasado
  }

  calcularProximoPago(proximoPago: string,periodicidad:number)
  {
    const proximoPago_ = new Date(proximoPago); // Convertir a objeto Date
    proximoPago_.setDate(proximoPago_.getDate() + periodicidad);
    proximoPago = formatDate(proximoPago_, 'yyyy-MM-dd', 'en-US');
    return proximoPago;
  }

  formatearFecha(fechaPago:string){
    return fechaPago=formatDate(fechaPago, 'yyyy-MM-dd', 'en-US');
  }
}
