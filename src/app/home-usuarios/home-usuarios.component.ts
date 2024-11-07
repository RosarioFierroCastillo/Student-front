import { Component, Injectable, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from '../data.service'
import { AccesoPuertaService } from '../acceso-puerta/acceso-puerta.service';
//import * as moment from 'moment';
import { LoadingService } from '../loading-spinner/loading-spinner.service';
//import { PasarelaService } from '../paypal/paypal.service';
//import { paypal } from '../modelos/paypal';
import * as QRCode from 'qrcode';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Notificaciones } from '../modelos/notificaciones';
import { NotificacionesService } from '../consultar-notificaciones/notificaciones.service';
import {  deudores, deudor } from "../modelos/deudas"
import { formatDate } from '@angular/common';
import { PersonasService } from '../ingresos-extraordinarios/personas.service';
import { Deudores } from '../ingresos-extraordinarios/deudores.model';



@Component({
  selector: 'app-home-usuarios',
  templateUrl: './home-usuarios.component.html',
  styleUrls: ['./home-usuarios.component.css']
})
export class HomeUsuariosComponent {

  constructor(private personasService:PersonasService,private notificacionesService: NotificacionesService,private http: HttpClient, private dataservice: DataService, public userService:AccesoPuertaService, private loadingService: LoadingService,public accesoPuerta:AccesoPuertaService/*, private pasarelaService: PasarelaService*/) {
  }

  nombre: any = this.dataservice.obtener_usuario(8);
  mes: any = "";
  filtroNotificaciones: "" | undefined;

  notificaciones: Notificaciones[] = [];
  notificaciones1: Notificaciones[] = [];

  ngOnInit(): void {

    this.mes = this.dataservice.mesActual();
    this.consultarNotificacion(this.dataservice.obtener_usuario(3), this.dataservice.obtener_usuario(1));
    this.startAutoSlide();
    this.ConsultarDeudores(0);

    console.log('Quiero ver que es estoooooooooooooooooooooooooooooo',this.dataservice.obtener_usuario(13))

    if(this.dataservice.obtener_usuario(13) == 'permitido'){
      this.isBlocked=false;
      this.ObtenerToken();
    }else{
      this.isBlocked=true;
      //this.mostrarMensajeBloqueo();
    }
  }






  consultarNotificacion(idFraccionamiento: any, id_destinatario: number) {
    this.loadingService.show();

    this.notificacionesService.consultarNotificacion(this.dataservice.obtener_usuario(3), this.dataservice.obtener_usuario(1)).subscribe((notificaciones: Notificaciones[]) => {
      //  console.log("notificaciones: ", valor);

        this.loadingService.hide();


        this.notificaciones = notificaciones;
        this.ordenarNotificaciones();

      });
  }

  ordenarNotificaciones(){
    this.notificaciones1 = this.notificaciones
    .sort((a, b) => {
      // Convertir las fechas a Date, teniendo en cuenta que "SIN FECHA" no es una fecha válida
      const fechaA = a.fecha !== 'SIN FECHA' ? new Date(a.fecha.replace(' ', 'T')) : new Date(0); // "SIN FECHA" se convierte a 1970-01-01
      const fechaB = b.fecha !== 'SIN FECHA' ? new Date(b.fecha.replace(' ', 'T')) : new Date(0); // "SIN FECHA" se convierte a 1970-01-01

      return fechaB.getTime() - fechaA.getTime(); // Ordenar por fecha descendente
    })
    .slice(0, 3); // Solo las últimas 3 notificaciones
}



currentIndex = 0;
  intervalId: any;
startAutoSlide(): void {
  this.intervalId = setInterval(() => {
    this.nextImage();
  }, 3000); // Cambia cada 3 segundos
}

nextImage(): void {
  const images = document.querySelectorAll('.carousel-images img');
  this.currentIndex = (this.currentIndex + 1) % images.length;
  const offset = -this.currentIndex * 100;
  (document.querySelector('.carousel-images') as HTMLElement).style.transform = `translateX(${offset}%)`;
}

ngOnDestroy(): void {
  clearInterval(this.intervalId);
}






deudores: deudores[] = [];
httpclient: any;
  deudor =new deudor();
  filtroDeudores:'' | undefined;
  filtroFecha:'' | undefined;
  indice: number = 0;
  cont: number = 1;
  verdaderoRango: number = 6;

  Deudores_totales:Deudores[]=[];
  Deudores_totales2:Deudores[]=[];
getDeudasOrdenadas() {
  return this.Deudores_totales
    .sort((a, b) => b.monto - a.monto) // Ordena de mayor a menor por monto
    .slice(0, 3); // Toma las tres primeras
}


ConsultarDeudores(tipo_deuda: number){
  this.loadingService.show();
  console.log("aaaaaaaa: " + this.dataservice.obtener_usuario(4))
  this.personasService.consultarDeudoresUsuarios(this.dataservice.obtener_usuario(1), tipo_deuda).subscribe(
    (deudasUsuario: Deudores[]) => {
      this.loadingService.hide();
      //this.mostrarGrid = true;

     this.Deudores_totales = deudasUsuario
      console.log('deudas', this.Deudores_totales);
      if(this.Deudores_totales.length==0){
        Swal.fire({
          title: 'El usuario seleccionado no tiene deudas  vencidas',
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

calcularTotal(retraso: number, periodicidad: number, monto: number, recargo: number): number {
  let total = 0;
  if(periodicidad!=0){
    total = ((retraso / periodicidad) * monto) + ((retraso / periodicidad) * recargo);
  }
  else{
    total = monto;

  }
  return isNaN(total) ? 0 : parseFloat(total.toFixed(2));
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








token:string='';
  enlaceConstruido:string ='';
  qrCodeDataUrl: string = '';
  isBlocked: boolean = false;



  ObtenerToken():boolean{
    this.accesoPuerta.consultarToken(this.dataservice.obtener_usuario(1)).subscribe(
      (token: string) => {
        this.token=token;
        console.log("El token obtenido essssssssssssssss:", this.token);
        this.construirQr();
        return true;
      },
      (error) => {

        console.error('Error al obtener o no tenia ningun token generado', error);
        return false;
      }
    );
    return false;
  }

  generarToken() {
    if(this.dataservice.obtener_usuario(13) == 'permitido'){
      this.isBlocked=false;
    }else{
      this.isBlocked=true;
      this.mostrarMensajeBloqueo();
      return;
    }

      this.accesoPuerta.generarToken(this.dataservice.obtener_usuario(1)).subscribe(
        (token: string) => {
          this.token=token;
          this.construirQr();
        },
        (error) => {

          console.error('Error al generar token', error);
        }
      );


  }

  construirQr(){
    this.enlaceConstruido=`https://localhost:44397/Student/PaseTemporal?token=${this.token}`;
    QRCode.toDataURL(this.enlaceConstruido, (err: any, url: string) => {
      if (err) {
        console.error('Error generando el QR:', err);
        return;
      }
      this.qrCodeDataUrl = url;
    });
  }

  descargarCodigoQR() {
    if(this.dataservice.obtener_usuario(13) == 'permitido'){
      this.isBlocked=false;
    }else{
      this.isBlocked=true;
      this.mostrarMensajeBloqueo();
      return;
    }
    fetch(this.qrCodeDataUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'codigoQR.png';
      link.click();

      // Liberar la URL del objeto creado para evitar pérdida de memoria
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Error al descargar el código QR:', error);
    });
  }



  mostrarMensajeBloqueo() {
    if (this.isBlocked) {
        Swal.fire({
            icon: 'info',
            title: 'Sección bloqueada',
            text: 'Esta sección está temporalmente inhabilitada. Por favor, intenta más tarde.',
            showConfirmButton: true, // Mostrar botón de aceptar
            confirmButtonText: 'Aceptar', // Texto del botón
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
        });
    }
}
}
