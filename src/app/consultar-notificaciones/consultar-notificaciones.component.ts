import { Component } from '@angular/core';
import { Personas } from './personas.model'; 
//import { PersonasService } from './personas.service';
import { NotificacionesService } from './notificaciones.service';
import { Notificaciones } from './notificaciones.model';
import { usuario, usuarios } from "../modelos/usuarios";
import { NumberFormatStyle } from '@angular/common';
import { DataService } from '../data.service';

@Component({ 
  selector: 'app-consultar-notificaciones',
  templateUrl: './consultar-notificaciones.component.html',
  styleUrls: ['./consultar-notificaciones.component.css']
})
export class ConsultarNotificacionesComponent {
  constructor(private NotificacionesService:NotificacionesService,
    private notificacionesService:NotificacionesService, private dataService: DataService ) { }
  personas: Personas[] = [];

  id_fraccionamineto: number=15;
  respuestaNotificacion: string | null = null;
  idNotificacion: number | undefined;
  notificaciones: Notificaciones[] = [];
  tipoSeleccionado: string = 'General';
  idFraccionamiento: number = 15;
  idUsuario: number = 0;
  filtroNotificaciones: "" | undefined;
  usuarios: usuarios[] = [];

  

  ngOnInit(): void {
  // this.consultarPersonas(this.id_fraccionamineto);
   // this.consultarNotificacionesPorId(this.dataService.obtener_usuario(1));
   console.log("eale: ", this.consultarNotificacion(this.dataService.obtener_usuario(1)))
   this.consultarNotificacion(this.dataService.obtener_usuario(1));
  }

consultarNotificacion(idFraccionamiento: any){
  this.NotificacionesService.consultarNotificacion(idFraccionamiento)
    .subscribe((notificaciones: Notificaciones[]) => {
      console.log("notificaciones: ",notificaciones);
      this.notificaciones = notificaciones;
    });
}

actualizarNotificaciones(): void {
  this.notificaciones = []; // Vaciar el arreglo antes de cargar nuevas notificaciones

  if (this.tipoSeleccionado === 'General') {
    this.idUsuario = 0;
  } else {
    // Asignar el ID de usuario correspondiente a la sesión (puedes ajustarlo según tu lógica de inicio de sesión)
    // this.idUsuario = ...;
    this.idUsuario = 1;
  } 
}

  filtrarPorTipo(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.tipoSeleccionado = target.value;
    this.actualizarNotificaciones();
  }
  
}
