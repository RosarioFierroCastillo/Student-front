import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { usuario, usuarios } from "../modelos/usuarios"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario.model';
import { ImageService } from './image.service';
import { Personas } from './personas.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {
  usuario: Usuario= {
    nombre:'',
    apellido_pat: '',
    apellido_mat: '',
    telefono: '',
    fecha_nacimiento: '',
    contrasenia: '',
    confirmarContrasena: '',
    correo:'',
    id_fraccionamiento:'',
  };
  //usuario = new usuario();
  persona:Personas[]=[];
  UserGroup: FormGroup;

  ngOnInit(): void {

    this.fetchDataUsers(this.dataService.obtener_usuario(1));
    this.Cargar_Imagen(this.dataService.obtener_usuario(1));
    //this.fetchData(this.dataService.obtener_usuario(1));
  }

  fetchDataUsers(id_administrador: any) {
    console.log("Id de consulta: " + id_administrador);
    this.dataService.consultarPersonaIndividual(id_administrador).subscribe((personas: Personas[]) => {
      console.log("fetch", personas);
      this.persona = personas;

      if (personas.length > 0) {
        const user = personas[0];
        const patchValueObj = {
          id_persona: user.id_persona || '',
          nombre: user.nombre || '',
          apellido_pat: user.apellido_pat || '',
          apellido_mat: user.apellido_mat || '',
          tipo_usuario: user.tipo_usuario || '',

          telefono: user.telefono || '',
          fecha_nacimiento: user.fecha_nacimiento || '', // Aquí asigna un valor predeterminado en caso de ser null
          correo: user.correo || '',
          contrasenia: user.contrasenia || '',
          id_fraccionamiento: user.id_fraccionamiento || '',
        };

        this.UserGroup.patchValue(patchValueObj);
      } else {
        // Si no se encuentra ninguna persona, podrías establecer valores predeterminados o limpiar el formulario
        this.UserGroup.patchValue({
          id_persona: '',
          nombre: '',
          apellido_pat: '',
          apellido_mat: '',
          tipo_usuario: '',
          id_lote: '',
          telefono: '',
          fecha_nacimiento: '', // Aquí podrías establecer un valor predeterminado en caso de ser null
          correo: '',
          contrasenia: '',
          id_fraccionamiento: '',
        });
      }
    });
  }




  constructor(private http: HttpClient, private dataService: DataService, private fb: FormBuilder, private imageService: ImageService) {

    this.UserGroup = this.fb.group({
      id_persona: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido_pat: ['', Validators.required],
      apellido_mat: ['', Validators.required],
      tipo_usuario: ['', Validators.required],
      id_lote: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      correo: ['', Validators.required],
      contrasenia: ['', Validators.required],
      confirmarContrasena: ['', Validators.required],
      id_fraccionamiento: ['', Validators.required],

    })
  }





  actualizar_usuario(
    usuarios: {
      id_persona: string,
      nombre: string,
      apellido_pat: string,
      apellido_mat: string,
      tipo_usuario: string,
      telefono: any,
      fecha_nacimiento: any,
      intercomunicador: any,
      codigo_Acceso: any,
      id_fraccionamiento: number,
      correo: any,
      contrasenia: any
    }
  ) {

    const params = {
      id_persona: this.dataService.obtener_usuario(1),
      nombre: usuarios.nombre,
      apellido_pat: usuarios.apellido_pat,
      apellido_mat: usuarios.apellido_mat,
      telefono: usuarios.telefono,
      id_fraccionamiento: this.dataService.obtener_usuario(1),
      tipo_usuario: this.dataService.obtener_usuario(7),
      intercomunicador: "123",
      codigo_acceso: "123",
      fecha_nacimiento: usuarios.fecha_nacimiento,
      correo: "urquidy12@gmail.com",
      contrasenia: usuarios.contrasenia,
      id_lote: 1
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    console.log("params  ", params);



    return this.http.put("https://localhost:44397/api/Personas/Actualizar_Persona", params).subscribe(
      (_response) => {

        Swal.fire({
          title: 'Datos actualizados correctamente',
          text: '',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Acción a realizar después de que el usuario hace clic en Cancelar
            console.log('Usuario hizo clic en Cancelar');
            // Puedes realizar acciones adicionales aquí
          }
        });


        console.log("hola");
        console.log("https://localhost:44397/api/Personas/Actualizar_Persona", params);


        this.ngOnInit();

      }
    )
  }


  //Seleccionado y generacion del arreglo de bytes de la imagen
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

          this.uploadFileToService(); // Llamar al método para subir el archivo al servicio
        };
        reader.readAsDataURL(file);
      }
    }
    input.value = ''; // Limpiar el input de tipo file
  }



  uploadFileToService(): void {
    if (this.archivoSeleccionado) { // Verificar si archivoSeleccionado no es null
      this.imageService.PostFile(this.dataService.obtener_usuario(1), this.archivoSeleccionado)
        .subscribe(response => {
          // Manejar la respuesta del servicio si es necesario
          console.log('Archivo cargado con éxito', response);


          Swal.fire({
            title: 'Fotografía actualizada correctamente',
            text: '',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            showCancelButton: false,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Acción a realizar después de que el usuario hace clic en Aceptar
              console.log('Usuario hizo clic en Aceptar');
              // Puedes realizar acciones adicionales aquí
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Acción a realizar después de que el usuario hace clic en Cancelar
              console.log('Usuario hizo clic en Cancelar');
              // Puedes realizar acciones adicionales aquí
            }
          });



        }, error => {


          Swal.fire({
            title: 'Fotografía actualizada correctamente',
            text: '',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            showCancelButton: false,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Acción a realizar después de que el usuario hace clic en Cancelar
              console.log('Usuario hizo clic en Cancelar');
              // Puedes realizar acciones adicionales aquí
            }
          });


        });
    }
    }

    Cargar_Imagen(id_persona: number){
      const id_Pago = 3; //  ID correspondiente
      this.imageService.obtenerImagenPorId(id_persona).subscribe(
        (imagen: ArrayBuffer) => {
          this.createImageFromBlob(new Blob([imagen]));
        },
        error => {
          console.error('Error al obtener la imagen', error);
        }
      );
    }

    createImageFromBlob(image: Blob): void {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.imagenSeleccionada = reader.result as string;
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    }


//menu cambio de contrasenia
showPopupForm = false;

mostrarFormulario(): void {
  this.showPopupForm = true;
}

ocultarFormulario(): void {
  this.showPopupForm = false;
}

}
