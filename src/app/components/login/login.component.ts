import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2'
import { UsuarioResponse } from '../../interfaces/usuario-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  pass:string='';
  Usuario:UsuarioResponse;

  loginForm: FormGroup;
  constructor(private fb:FormBuilder,
              private router:Router,
              private loginService: LoginService) { 
    this.crearFormulario();
  }

  ngOnInit(): void {
  }
  
 


  crearFormulario(){
    this.loginForm = this.fb.group({
      usuario:['', Validators.required],
      password: ['',Validators.required]
    })
  }


  validarLogin(){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });

    Swal.showLoading();

    this.loginService.getLogin(this.loginForm.get('usuario').value)
                      .subscribe( (resp:UsuarioResponse) =>{
                      
                      const user = this.loginForm.get('usuario').value;
                      const pass =   this.loginForm.get('password').value;
                      if(user === resp.username && pass === resp.contrasena){
                        Swal.fire({
                          icon: 'success',
                          title: 'OK',
                          text: 'Ingresado Correctamente!!',
                          allowOutsideClick: false
                        });
                        localStorage.setItem('usuario',user);
                        this.router.navigate(['/dashboard']);
                        this.loginService.setUser(resp);
                      }else{
                        Swal.fire({
                          icon: 'error',
                          title: 'Upsss..',
                          text: 'Usuario y/o Contraseña Incorrectas!',
                          allowOutsideClick: false
                        });
                        this.loginForm.reset();
                        }
                      },err =>{
                        console.log('entro por el error');
                        console.log(err);
                        if(err.status==404){
                          Swal.fire({
                            icon: 'error',
                            title: 'Upsss..',
                            text: 'Usuario y/o Contraseña Incorrectas!',
                            allowOutsideClick: false
                          });
                        }else{
                          Swal.fire({
                            icon: 'error',
                            title: 'Conect Refused!!',
                            text: 'No hay conexion con el servidor',
                            allowOutsideClick: false
                          });
                        }                        
                        
                        
                        this.loginForm.reset();
                      });               

    
    
    
  }


}
