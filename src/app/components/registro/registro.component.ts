import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {


  forma:FormGroup;
  usuario:UsuarioResponse;


 

  constructor(public fb:FormBuilder,
              public loginSvc:LoginService,
              public router:Router) { 

    this.crearFormulario();
  }

  ngOnInit(): void {
  }


  crearFormulario(){
    this.forma = this.fb.group({
      nombrecompleto:   ['', [Validators.required, Validators.minLength(6)]],
      username:         ['', [Validators.required,Validators.minLength(6)]],
      correo:           ['', [Validators.required, Validators.email]],
      descUsuario:      ['',Validators.minLength(5)],
      observaciones:    [''],
      contrasena:       ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  guardarUsuario(){
    
      Swal.fire({
        icon: 'info',
        title: 'Espere...',
        text: 'Guardando Informacion!',
        allowOutsideClick: false
      });
  
      Swal.showLoading();

    try {
      if(this.forma.invalid){
        return;
      }else{
        console.log('esto es lo que va a mandar al servicio');
      
      console.log(this.forma.get('correo').value);
      const correo = this.forma.get('correo').value;
      this.loginSvc.crearUsuario(this.forma.value).subscribe(result =>{
        if(result){
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Guardado Correctamente!!',
              allowOutsideClick: false
            });
            this.router.navigateByUrl(`/postregistro/${correo}`);
          }, 1000);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Upsss..',
            text: 'Ha ocurrido un error intenta mas tarde!!',
            allowOutsideClick: false
          });
          this.forma.reset();
        }
        
      },error=>{
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'No hay conexion con el servidor!',
          allowOutsideClick: false
        });

        this.forma.reset();
        
      });
      }
      
      this.forma.reset();
      
      
        
    } catch (error) {
      
      console.error(error);
      
      
    }
    
    
  }

  getNombreCompletoNoValido(){
    return this.forma.get('nombrecompleto').invalid && this.forma.get('nombrecompleto').touched;
  }

  getUserNameNoValido(){
    return this.forma.get('username').invalid && this.forma.get('username').touched;
  }

  getCorreoNoValido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }

  getDescUsuarioNoValido(){
    return this.forma.get('descUsuario').invalid && this.forma.get('descUsuario').touched;
  }

  getContrasenaNoValida(){
    return this.forma.get('contrasena').invalid && this.forma.get('contrasena').touched
  }




  

}
