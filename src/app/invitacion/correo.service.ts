import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import  emailjs  from '@emailjs/browser';
@Injectable({
  providedIn: 'root'
})
export class CorreoService {

  constructor(private dataService:DataService) { }

  /*
  Enviar_Correo(correo_destinatario: string, mensaje: string){
    emailjs.send("service_jw5uhit","template_anvzzmo",{
      from_name: "Arboledas Administración",
      to_name: "A quien corresponda",
      message: mensaje,
      reply_to: "none",
      to_email: correo_destinatario,
      },"oroC5hc9EFcvhGRoh");

  }
  */


  Enviar_Correo(correo_destinatario: string, mensaje: string){
    emailjs.send("service_kmgxw3p","template_at8d65n",{
      administrador: this.dataService.obtener_usuario(2),
      message: mensaje,
      to_reply: "none",
      to_email: correo_destinatario
      },"el2ueIoClIaD7cY5E");
  }

}
