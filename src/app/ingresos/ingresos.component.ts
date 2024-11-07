import { Component, Injectable, OnInit, Renderer2, ElementRef, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { deudas, deuda, historial } from "../modelos/deudas"
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DatePipe } from '@angular/common'
import { Personas } from '../ingresos-extraordinarios/personas.model';
import { PersonasService } from '../ingresos-extraordinarios/personas.service';
import Swal from 'sweetalert2';
import { DeudaService } from '../ingresos-extraordinarios/deuda.service';
import { formatDate } from '@angular/common';
import { Deudores } from '../ingresos-extraordinarios/deudores.model';
import { LoadingService } from '../loading-spinner/loading-spinner.service';
import {getDownloadURL, ref, Storage, uploadBytesResumable} from '@angular/fire/storage';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.css']
})
export class IngresosComponent {
  tipo_formulario: string = '';
  httpclient: any;
  UserGroup: FormGroup;
  // UserGroup2: FormGroup;
  total: number = 0;
  fecha_corte: string = '';
  diasAtraso: number = 0;
  recargo: number = 0;
  deudas: deudas[] = [];
  deuda = new deuda();
  id_deudas: any;
  periodicidad: number = 0;
  destinatario: string = '';
  destinatario2: string = '';
  especifico: boolean = false;
  formulario: any;
  personas: Personas[] = [];
  id_deuda: number = 0;
  id_deudor: number = 0;
  tipo_pago: string = "";
  monto: number = 0;
  monto_restante: number = 0;
  fecha_actual: string = new Date().toISOString().split('T')[0]; // 'yyyy-MM-dd'


  deudasDelUsuario: Deudores[] = [];
  deudasDelUsuarioExtra: Deudores[] = [];
  res: number = 0;
  indice: number = 0;
  verdaderoRango: number = 5;
  cont: number = 1;
  registrosTotales: number = 0;
  historial1: historial[] = [];
  historial: historial[] = [];
  showHelp: boolean = false;


  mostrarGrid: boolean = false;

  constructor(private personasService: PersonasService, private deudaService: DeudaService, private renderer: Renderer2, private el: ElementRef, private http: HttpClient, private dataService: DataService, private fb: FormBuilder, private personaService: PersonasService, private loadingService: LoadingService) {

    this.UserGroup = this.fb.group({
      usuarioExtra: [null, Validators.required],
      deudaExtra: [null, Validators.required],
      monto_restante: ['', Validators.required],
      montoDeudaExtra: ['', Validators.required],
      comprobante: [null, Validators.required],
      fechaCorteExtra: [{ value: '', disabled: true }],

    })

    /*
       this.UserGroup = this.fb.group({
            fraccionamiento: ['', Validators.required],
            monto: ['', Validators.required],
            nombre: ['', Validators.required],
            descripcion: ['', Validators.required],
            dias_gracia: ['', Validators.required],
            periodicidad: ['', Validators.required],
            recargo: ['', Validators.required],
            proximo_pago: ['', Validators.required],
            destinatario: ['', Validators.required],


          })

          this.UserGroup2 = this.fb.group({
           fraccionamiento: ['', Validators.required],
           monto: ['', Validators.required],
           nombre: ['', Validators.required],
           descripcion: ['', Validators.required],
           dias_gracia: ['', Validators.required],
           periodicidad: ['', Validators.required],
           recargo: ['', Validators.required],
           proximo_pago: ['', Validators.required],
           destinatario2: ['', Validators.required],
           cboxpersonas: ['', Validators.required],


         })
   */
  }

  ngOnInit(): void {

    this.consultarHistorialDeudas(this.dataService.obtener_usuario(3));
    this.consultarPersonas(this.dataService.obtener_usuario(3));
    //  this.tipo_formulario=='ordinario';

  }

  limpiar() {

    this.UserGroup.reset();

  }

  paginador_atras() {

    if (this.indice - this.verdaderoRango >= 0) {
      this.historial1 = this.historial.slice(this.indice - this.verdaderoRango, this.indice);
      this.indice = this.indice - this.verdaderoRango;
      this.cont--;
    }
  }

  paginador_adelante() {
    if (this.historial.length - (this.indice + this.verdaderoRango) > 0) {
      this.indice = this.indice + this.verdaderoRango;
      this.historial1 = this.historial.slice(this.indice, this.indice + this.verdaderoRango);
      this.cont++;
      // this.consultarNotificacion
    }

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


  consultarPersonas(idFraccionamiento: number): void {
    this.personasService.consultarPersonasPorFraccionamiento(idFraccionamiento).subscribe(
      (personas: Personas[]) => {
        this.personas = personas;
        console.log('Personas:', personas);
      },
      (error) => {
        // Manejo de errores
        console.error('Error:', error);
        Swal.fire({
          title: 'Error al consultar a las personas',
          text: 'Contacte con el administrador de la pagina',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }


  onChangeUsuario(event: any) {
    this.deudasDelUsuario = [];
    // Aquí puedes agregar la lógica que deseas ejecutar cuando cambia la opción seleccionada

    //const valorSeleccionado = event.target.value;
    //const destinatarioId = parseInt(valorSeleccionado.split(' - ')[0]);
    this.id_deudor = event.target.value;
    console.log("deudor: ", this.id_deudor)
    this.personasService.consultarDeudoresExtraoridinarios(this.dataService.obtener_usuario(3), this.id_deudor).subscribe(
      (deudasUsuario: Deudores[]) => {
        this.deudasDelUsuario = deudasUsuario
        console.log('deudas extraordinarias del usuario', deudasUsuario);
        if (this.deudasDelUsuario.length != 0) {
          this.onChangeDeuda({ target: { selectedIndex: 0 } });
        } else {
          this.id_deuda = 0;
          this.monto = 0;
          this.diasAtraso = 0;
          this.total = 0;
          this.recargo = 0;
          this.fechaProximoPago = '';
          this.periodicidad = 0;
          Swal.fire({
            title: 'El usuario seleccionado no tiene deudas extraordinarias vencidas',
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

    this.monto = 0;
    this.periodicidad = 0;
    this.fecha_corte = '';

  }


  onChangeSelection(event: any) {

    if (event.target.value == 'extraordinario') {
      this.formulario = 'extraordinarios'
    }
    else {
      this.formulario = 'ordinarios'
    }
  }

  toggleCollapsible(event: Event): void {
    const element = event.currentTarget as HTMLElement;
    const content = element.nextElementSibling as HTMLElement; // Convertir a HTMLElement
    this.renderer.addClass(element, 'active');
    if (content.style.display === 'block') {
      this.renderer.setStyle(content, 'display', 'none');
      this.renderer.removeClass(element, 'active');
    } else {
      this.renderer.setStyle(content, 'display', 'block');
    }
  }



  onRowClicked(lote: any) {
    this.id_deudas = lote['id_deudas']

  }



  consultarHistorialDeudas(id_fraccionamiento: any) {


    this.loadingService.show()

    this.dataService.fetchDataHistorialDeudas(id_fraccionamiento).subscribe((historial: historial[]) => {


      this.mostrarGrid = true;
      this.loadingService.hide()

      console.log(historial);
      this.historial = historial;
      this.historial1 = this.historial.slice(this.indice, this.indice + this.verdaderoRango);
    });
  }



  edit(deudas: {
    id_deudas: any;
    monto: any;
    nombre: any;
    descripcion: any;
    dias_gracia: any;
    periodicidad: any;
    recargo: any;
    proximo_pago: any;
  }) {
    this.deuda.id_deudas = deudas.id_deudas;
    this.deuda.monto = deudas.monto;
    this.deuda.nombre = deudas.nombre;
    this.deuda.descripcion = deudas.descripcion;
    this.deuda.dias_gracia = deudas.dias_gracia;
    this.deuda.periodicidad = deudas.periodicidad;
    this.deuda.recargo = deudas.recargo;
    this.deuda.proximo_pago = deudas.proximo_pago;
  }

  fechaProximoPago: string = '';

  onChangeOption(event: any) {
    const selectedValue = event.target.value;

    this.destinatario = selectedValue;
  }

  onChangeOption2(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue == 'personalizado') {
      this.especifico = true;
      // this.onChangeUsuario({ target: { selectedIndex: 2 } });
    } else {
      this.especifico = false;
      this.destinatario = selectedValue;
      this.destinatario2 = this.destinatario;
      console.log("Destinatarioooooooooooooooooo:" + this.destinatario);
      console.log("Destinatarioooooooooooooooooo2:" + this.destinatario2);


    }


  }



  actualizar_deuda(
    deudas: { monto: number, nombre: string, descripcion: string, dias_gracia: number, periodicidad: number, recargo: number, id_deudas: number }
  ) {

    const params = {
      monto: deudas.monto,
      nombre: deudas.nombre,
      descripcion: deudas.descripcion,
      dias_gracia: deudas.dias_gracia,
      periodicidad: deudas.periodicidad,
      recargo: deudas.recargo,
      id_deudas: this.id_deudas
    };

    console.log("deudas: ", deudas)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log("actualizar: ", params)

    return this.http.put("http://159.54.141.160/api/Deudas/Actualizar_Deuda", params).subscribe(
      (_response) => {
        console.log("actualiza", params)
        this.ngOnInit();
        this.UserGroup.reset();

      }
    )

  }



  /*
  delete(id_deudas: any){
    return this.http.delete("http://159.54.141.160/api/Deudas/Eliminar_Deuda?id_deudas="+id_deudas).subscribe(
      () => {
        this.consultarHistorialDeudas(this.dataService.obtener_usuario(3));

      })

  }
  */

  /* A PARTIR DE AQUI EMPIEZA LO DE LAS DEUDAS EXTRAORDINARIAS*/
  /* A PARTIR DE AQUI EMPIEZA LO DE LAS DEUDAS EXTRAORDINARIAS*/
  /* A PARTIR DE AQUI EMPIEZA LO DE LAS DEUDAS EXTRAORDINARIAS*/


  fechaCorte_extra: string = '';


  actualizar_deudaExtra(
    deudas: { monto: number, nombre: string, descripcion: string, proximo_pago: Date, id_deudas: number }
  ) {

    const params = {
      monto: deudas.monto,
      nombre: deudas.nombre,
      descripcion: deudas.descripcion,
      id_deudas: this.id_deudas,
      proximo_pago: deudas.proximo_pago
    };

    console.log("deudas: ", deudas)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log("actualizar: ", params)

    return this.http.put("http://159.54.141.160/api/Deudas/Actualizar_Deuda", params).subscribe(
      (_response) => {
        console.log("actualiza", params)
        this.ngOnInit();
        this.UserGroup.reset();

      }
    )

  }


  onChangeDeuda(event: any) {
    //  const selectedIndex = event.target.selectedIndex;
    const deudaSeleccionada = this.deudasDelUsuario[event.target.selectedIndex - 1];
    this.id_deuda = deudaSeleccionada.id_deuda;
    // console.log("deuda: ",deudaSeleccionada)

    //this.monto_restante = deudaSeleccionada.monto_restante;

    // this.fecha_corte = formatDate(deudaSeleccionada.proximo_pago, 'yyyy-MM-dd', 'en-US');
    this.periodicidad = deudaSeleccionada.periodicidad;

    // Obtener la fecha actual en formato 'yyyy-MM-dd'
    this.recargo = 0;

    this.fecha_corte = formatDate(deudaSeleccionada.proximo_pago, 'yyyy-MM-dd', 'en-US');
    if (this.fecha_corte < this.fecha_actual) {
      this.recargo = deudaSeleccionada.recargo;
    }

    // Calcular la fecha del próximo pago sumando la periodicidad a la fecha de vencimiento
    const proximoPago = new Date(deudaSeleccionada.proximo_pago); // Convertir a objeto Date
    proximoPago.setDate(proximoPago.getDate() + this.periodicidad); // Sumar la periodicidad en días

    // Formatear la fecha del próximo pago
    this.fechaProximoPago = formatDate(proximoPago, 'yyyy-MM-dd', 'en-US');

    const fechaActual = new Date(); // Fecha actual
    this.diasAtraso = Math.floor((fechaActual.getTime() - proximoPago.getTime()) / (1000 * 3600 * 24));

    // Verificar si los días de atraso son mayores que los días de gracia y agregar recargo

    this.total = deudaSeleccionada.monto_restante

    if (this.diasAtraso > deudaSeleccionada.dias_gracia) {
      // Agregar el recargo al monto de la deuda

      this.total += deudaSeleccionada.recargo; // Agregar el valor de lote al recargo

    }

  }

  private storage: Storage = inject(Storage);
  urlComprobante: string = '';


  guardarImagenFirebase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.archivoSeleccionado != null) {
        const filepath = `Comprobantes/${this.archivoSeleccionado.name}`;
        const fileRef = ref(this.storage, filepath);
        const uploadFile = uploadBytesResumable(fileRef, this.archivoSeleccionado);
        uploadFile.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progreso de la carga a Firebase: ', progress);
          },
          (error) => {
            console.log('Error al cargar el archivo a Firebase: ', error);
            reject(error); // Rechaza la promesa
          },
          async () => {
            console.log('El archivo se guardó con éxito en Firebase');
            const url = await getDownloadURL(fileRef);
            this.urlComprobante = url;
            console.log('URL del archivo subido: ', url);
            resolve(); // Resuelve la promesa
          }
        );
        console.log(this.archivoSeleccionado.name);
      } else {
        reject(new Error('No se ha seleccionado ningún archivo'));
      }
    });
  }


  async Generar_Recibo(id_deuda: number): Promise<void> {
    try {
        const response = await fetch(`http://159.54.141.160/api/Deudas/GenerarRecibo?id_deuda=${id_deuda}`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recibo_${id_deuda}.pdf`; // Nombre del archivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    } catch {
        console.error('Error al generar el recibo.');
    }
}



  async pagarDeudaExtraordinaria(montoDeudaExtra: any) {

    this.tipo_pago = "pagado";

    if (montoDeudaExtra < this.total) {
      this.tipo_pago = "abono";
      //  montoDeudaExtra = this.monto_restante - montoDeudaExtra;
    }

    if (this.archivoSeleccionado) {
    try {

      await this.guardarImagenFirebase();


        this.deudaService.pagarDeudaExtraordinaria(this.recargo, this.id_deudor, this.id_deuda, this.dataService.obtener_usuario(3), this.fechaProximoPago, this.archivoSeleccionado, this.tipo_pago, this.total, montoDeudaExtra).subscribe(
          (respuesta) => {
            if (respuesta) {
              Swal.fire({
                title: 'La deuda ha sido pagada exitosamente',
                text: '',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              console.log('La deuda ha sido pagada exitosamente');
              this.onChangeUsuario({ target: { selectedIndex: 0 } });
              this.consultarHistorialDeudas(this.dataService.obtener_usuario(3));
            } else {
              console.log('Hubo un problema al pagar la deuda');
              Swal.fire({
                title: 'Hubo un problema al pagar la deuda',
                text: '',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          (error) => {
            console.error('Error al intentar pagar la deuda:', error);
            Swal.fire({
              title: 'Hubo un problema al pagar la deuda',
              text: 'Por favor contáctese con el administrador de la página',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } catch (error) {
        console.error('Error al guardar la imagen en Firebase:', error);
        Swal.fire({
          title: 'Hubo un problema al subir el comprobante',
          text: 'Por favor intente de nuevo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      Swal.fire({
        title: 'Por favor cargue un comprobante de pago',
        text: '',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }



  imagenSeleccionada: any; // Variable para mostrar la imagen seleccionada en la interfaz
  archivoSeleccionado: File | null = null;
  imagenEnBytes: Uint8Array | null = null;


  handleInputFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenSeleccionada = reader.result as string;
          this.archivoSeleccionado = file; // Guardar el archivo seleccionado
          Swal.fire({
            title: 'Comprobante cargado correctamente',
            text: '',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });

        };
        reader.readAsDataURL(file);
      }
    }
    input.value = ''; // Limpiar el input de tipo file
  }

  apiUrl:string = 'http://159.54.141.160/Reportes/Reporte_IngresosDeudas';
  reporteIngresos(){
    this.loadingService.show();


    this.http.get(`${this.apiUrl}?id_fraccionamiento=${this.dataService.obtener_usuario(3)}`, { responseType: 'blob' })
    .subscribe(blob => {
      this.loadingService.hide();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_IngresosFraccionamiento_${this.dataService.obtener_usuario(3)}.pdf`; // Nombre del archivo a descargar
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Error al descargar el reporte:', error);
    });
}


}



