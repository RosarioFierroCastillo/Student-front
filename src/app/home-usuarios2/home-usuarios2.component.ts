import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataService } from '../data.service'
import { LoadingService } from '../loading-spinner/loading-spinner.service';
import { AccesoPuertaService } from '../acceso-puerta/acceso-puerta.service';

import { Notificaciones } from '../modelos/notificaciones';
import { NotificacionesService } from '../consultar-notificaciones/notificaciones.service';

@Component({
  selector: 'app-home-usuarios2',
  templateUrl: './home-usuarios2.component.html',
  styleUrls: ['./home-usuarios2.component.css']
})
export class HomeUsuarios2Component {


  constructor(private notificacionesService: NotificacionesService,private http: HttpClient, private dataservice: DataService, public userService:AccesoPuertaService, private loadingService: LoadingService,public accesoPuerta:AccesoPuertaService/*, private pasarelaService: PasarelaService*/) {
  }

  nombre: any = this.dataservice.obtener_usuario(8);
  mes: any = "";

  notificaciones1: Notificaciones[] = [];

  ngOnInit(): void {

    this.mes = this.dataservice.mesActual();
    this.consultarNotificacion(this.dataservice.obtener_usuario(3), this.dataservice.obtener_usuario(1));
  }






  consultarNotificacion(idFraccionamiento: any, id_destinatario: number) {
    this.loadingService.show();

    this.notificacionesService.consultarNotificacion(this.dataservice.obtener_usuario(3), this.dataservice.obtener_usuario(1)).subscribe((notificaciones: Notificaciones[]) => {
      //  console.log("notificaciones: ", valor);

        this.loadingService.hide();


        this.notificaciones1 = notificaciones;

      });
  }
}
