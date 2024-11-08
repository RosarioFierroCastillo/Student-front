import { Component, ViewChild } from '@angular/core';
import { AcuerdosService } from './acuerdos.service';
import { Acuerdos } from '../modelos/acuerdos';
import { DataService } from '../data.service';
import { NoEncontradoDirective } from '../no-encontrado/no-encontrado.directive';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { LoadingService } from '../loading-spinner/loading-spinner.service';



@Component({
  selector: 'app-consultar-acuerdos',
  templateUrl: './consultar-acuerdos.component.html',
  styleUrls: ['./consultar-acuerdos.component.css'],
 // directives: [NoEncontradoDirective] // Asegúrate de incluir la directiva en la lista de directivas

})
export class ConsultarAcuerdosComponent {
@ViewChild('formCrear', { static: false }) formCrear!: NgForm;
//OJOOOOOOOOOOOOOOO
id_fraccionamiento:number=this.dataService.obtener_usuario(1);
filtroAcuerdos:'' | undefined;
filtroFecha:'' | undefined;
//OJOOOOOOOOOOOOO
fecha: string="";
//fecha: any;
acuerdos: Acuerdos[] = [];
indice: number = 0;
verdaderoRango: number = 6;
cont: number = 1;
acuerdos1: Acuerdos[] = [];
mostrarGrid: boolean = false;

constructor(private fb: FormBuilder,private acuerdosService: AcuerdosService,private dataService:DataService, private loadingService: LoadingService) {}

ngOnInit(): void {
  //this.consultarAcuerdos();
  this.consultarAcuerdos();


}






agregarAcuerdo(formulario: any) {
  //const { idFraccionamiento, asunto, detalles } = formulario;
  this.fecha = this.obtenerFechaActualFormateada();
  const asunto = formulario.asunto;
  const detalles = formulario.detalles;

  console.log("veamos: ",asunto, detalles,this.fecha)
  this.acuerdosService.agregarAcuerdo(this.dataService.obtener_usuario(1), asunto, detalles,this.fecha)
    .subscribe(
      (respuesta: string) => {
        Swal.fire({
          title: 'Acuerdo agregado correctamente',
          text: '',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      //  this..reset();
       // this.formCrear.resetForm();
        console.log('Acuerdo agregado:', respuesta);
        this.ngOnInit();
        //location.reload();
      },
      (error) => {
        Swal.fire({
          title: 'Por favor, complete todos los campos',
          text: '',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        console.error('Error al agregar acuerdo:', error);
      }
    );
}



pageChanged(event: any) {
  // Determinar la acción del paginator
  if (event.previousPageIndex < event.pageIndex) {
    // Se avanzó a la siguiente página
    this.paginador_adelante();
  } else if (event.previousPageIndex > event.pageIndex) {
    // Se retrocedió a la página anterior
    this.paginador_atras();
  }
}



  paginador_atras() {

    if (this.indice - this.verdaderoRango >= 0) {
      this.acuerdos1 = this.acuerdos.slice(this.indice - this.verdaderoRango, this.indice);
      this.indice = this.indice - this.verdaderoRango;
      this.cont--;
    }
  }

  paginador_adelante() {
    if (this.acuerdos.length - (this.indice + this.verdaderoRango) > 0) {
      this.indice = this.indice + this.verdaderoRango;
      this.acuerdos1 = this.acuerdos.slice(this.indice, this.indice + this.verdaderoRango);
      this.cont++;
     // this.consultarNotificacion
    }

  }


  consultarAcuerdos(): void {

    this.loadingService.show()

    const idFraccionamiento = this.dataService.obtener_usuario(1);

    this.acuerdosService.consultarAcuerdosPaginados(idFraccionamiento, 0, 100).subscribe(
      (data: Acuerdos[]) => {

        this.mostrarGrid = true;
        this.loadingService.hide()



        if(data.length!=0){

          this.acuerdos = data;
          this.acuerdos1 = this.acuerdos.slice(this.indice, this.indice + this.verdaderoRango);
        //  console.log(this.acuerdos1);
        }
      });



  }


  eliminarAcuerdo(id_acuerdo: number): void {
    const idFraccionamiento = this.dataService.obtener_usuario(1); // Reemplaza con el ID de fraccionamiento correspondiente
    this.acuerdosService.eliminarAcuerdo(id_acuerdo,this.dataService.obtener_usuario(3)).subscribe(
      (respuesta: any) => {
        console.log('Acuerdo eliminado:', respuesta);
        Swal.fire({
          title: 'Acuerdo eliminado correctamente',
          text: '',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          console.log(result);  // Revisa qué contiene el objeto `result`
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
        this.consultarAcuerdos();
      },
      (error) => {
        console.error('Error al eliminar acuerdo:', error);
        Swal.fire({
          title: 'Error al eliminar el acuerdo',
          text: 'vuelva a intentarlo mas tarde',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
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


  onFechaSeleccionada() {
    // Aquí puedes realizar las acciones que desees cuando se selecciona una fecha

    // Por ejemplo, podrías llamar a una función para filtrar datos basados en la fecha seleccionada
    this.filtrarDatosPorFecha(this.filtroFecha);
  }

  filtrarDatosPorFecha(fecha: any) {

    console.log("Se seleccionó una fecha:", fecha);

    this.acuerdosService.consultarAcuerdosFecha(this.dataService.obtener_usuario(1), 0, 100, fecha ).subscribe(
      (data: Acuerdos[]) => {


        //if(data.length!=0){

          this.acuerdos = data;
          this.indice = 0;
          this.acuerdos1 = this.acuerdos.slice(0, this.verdaderoRango);
        //  console.log(this.acuerdos1);
        console.log("acuerdddddd: ",this.acuerdos1.length)


        }
     // }
    );



  }



  modalAsunto:string='';
  modalDetalles:string='';
  modalFecha:string='';
  modalId:number=0;

  acuerdoGroup1: FormGroup | undefined;

  // seleccionar(acuerdoId:number, acuerdoAsunto:string, acuerdoDetalles:string,acuerdoFecha:string){
  //   // this.id_usuario = usuario;

  //   this.acuerdoGroup1 = this.fb.group({
  //     id_acuerdo: [acuerdoId, Validators.required],
  //     asunto_acuerdo: [acuerdoAsunto, Validators.required],
  //     detalles_acuerdo: [acuerdoDetalles, Validators.required],
  //     fecha_acuerdo: [acuerdoFecha, Validators.required],
  //   })

  // }


  //selectedAcuerdo: any = null;

  selectedAcuerdo: any = {
    id:0,
    asunto: '',
    detalles: '',
    fecha: ''
  };
  idAcuerdoModificar:number=0;
  mostrarModal: boolean = false;

  seleccionar(acuerdo: any) {
    this.selectedAcuerdo = acuerdo;
    this.idAcuerdoModificar=acuerdo.id;
    console.log('selectedAcuerdo:', JSON.stringify(this.selectedAcuerdo, null, 2));
    this.mostrarModal = true;
  }


  actualizarAcuerdo(idAsunto:number,asunto:string,detalles:string,fecha:string){
    console.log(`nuevo acuerdo: ${this.selectedAcuerdo.id_acuerdo} , ${asunto} , ${detalles} , ${fecha}`);

    this.acuerdosService.actualizarAcuerdo(this.selectedAcuerdo.id_acuerdo,this.dataService.obtener_usuario(3),asunto,detalles,fecha).subscribe(
      (respuesta: any) => {
        console.log('Acuerdo eliminado:', respuesta);
        Swal.fire({
          title: 'Acuerdo actualizado correctamente',
          text: '',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          console.log(result);  // Revisa qué contiene el objeto `result`
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
        this.consultarAcuerdos();

      },
      (error) => {
        console.error('Error al eliminar acuerdo:', error);
        Swal.fire({
          title: 'Error al actualizar el acuerdo',
          text: '',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        // Manejo de errores
      }
    );

  }




}

