import { Component } from '@angular/core';
import { AcuerdosService } from '../acuerdos/acuerdos.service';
import { Acuerdos } from '../acuerdos/acuerdos.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-consultar-acuerdos',
  templateUrl: './consultar-acuerdos.component.html',
  styleUrls: ['./consultar-acuerdos.component.css']
})
export class ConsultarAcuerdosComponent {
//OJOOOOOOOOOOOOOOO
id_fraccionamiento:number=this.dataService.obtener_usuario(1);
filtroAcuerdos:'' | undefined;
filtroFecha:'' | undefined;
//OJOOOOOOOOOOOOO
fecha: string=""; 
//fecha: any;
acuerdos: Acuerdos[] = [];
constructor(private acuerdosService: AcuerdosService,private dataService:DataService) {}

ngOnInit(): void {
  this.consultarAcuerdos();
}


  agregarAcuerdo(formulario: any) {
    const { idFraccionamiento, asunto, detalles } = formulario;
  this.fecha = this.obtenerFechaActualFormateada();
  //this.fecha = new Date();

    //OJOOOOOOOOOOOOOOO
    
    //OJOOOOOOOOOOOOOOOOOOO
    this.acuerdosService.agregarAcuerdo(this.id_fraccionamiento, asunto, detalles,this.fecha)
      .subscribe(
        (respuesta: string) => {
          console.log('Acuerdo agregado:', respuesta);
          this.consultarAcuerdos();
        },
        (error) => {
          console.error('Error al agregar acuerdo:', error);
        }
      );
  }

  consultarAcuerdos(): void {
    const idFraccionamiento = this.dataService.obtener_usuario(1); 
    this.acuerdosService.consultarAcuerdos(idFraccionamiento).subscribe(
      (data: Acuerdos[]) => {
        this.acuerdos = data;
      },
      (error) => {
        console.error('Error al obtener acuerdos:', error);
        // Manejo de errores
      }
    );
  }

  eliminarAcuerdo(id_acuerdo: number,id_fraccionamiento: number): void {
    const idFraccionamiento = this.dataService.obtener_usuario(1); // Reemplaza con el ID de fraccionamiento correspondiente
    this.acuerdosService.eliminarAcuerdo(id_acuerdo,id_fraccionamiento).subscribe(
      (respuesta: any) => {
        console.log('Acuerdo eliminado:', respuesta);
        // Vuelve a cargar los acuerdos después de eliminar
        this.consultarAcuerdos();
      },
      (error) => {
        console.error('Error al eliminar acuerdo:', error);
        // Manejo de errores
      }
    );
  }







  obtenerFechaActualFormateada(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1; // Los meses van de 0 a 11, sumamos 1 para obtener el mes actual
    let day: string | number = today.getDate();
  
    // Aseguramos que el mes y el día tengan dos dígitos
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
  
   // console.log(`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
  // return `${day}-${month}-${year}`;
  }
  


}
