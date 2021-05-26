import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  areaCambioContrasena:boolean;
  usuario:UsuarioResponse;
  username:string='';
  descUsuario:string='';
  fecha:string = '';
  estado:string = '';
  rol:string = '';
  correo:string='';
  nombreCompleto:string='';

  constructor(public loginService:LoginService,
              public router:Router) { 
    
    
    this.areaCambioContrasena = false;    

    if(localStorage.getItem('usuario')===null){
      this.router.navigate(['/login']);
    }else{
      if(this.loginService.UsuarioLogueado){
        this.usuario = this.loginService.UsuarioLogueado;
        console.log(this.usuario);
        this.username = this.usuario.username;
        this.descUsuario = this.usuario.descUsuario;
        this.fecha = this.usuario.feciniusuario.toString();
        this.estado = this.usuario.estado.toString();
        this.rol = this.usuario.codperfil === 1 ? 'Administrador' : 'Usuario Estandar';
        this.correo = this.usuario.correo;
        this.nombreCompleto = this.usuario.nombrecompleto;
      }else{
        this.loginService.getLogin(localStorage.getItem('usuario')).subscribe(resp =>{
          this.usuario = resp            
          this.username = this.usuario.username;
          this.descUsuario = this.usuario.descUsuario;
          this.fecha = this.usuario.feciniusuario.toString();
          this.estado = this.usuario.estado.toString();
          this.rol = this.usuario.codperfil === 1 ? 'Administrador' : 'Usuario Estandar';
          this.correo = this.usuario.correo;
          this.nombreCompleto = this.usuario.nombrecompleto;
        })
      }
    }
    
  }
  
  ngOnInit(): void {
  }

  cambioContrasena(){
    this.areaCambioContrasena = true;
  }

  guardarContrasena( forma:NgForm){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });

    Swal.showLoading();
    if(this.usuario.contrasena === forma.controls.passanterior.value){
      this.usuario.contrasena = forma.controls.passnuevo.value;
      this.loginService.actualizarContrasena(this.usuario).subscribe(resp=>{
        console.log(resp);
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Contraseña Cambiada Correctamente!!',
          allowOutsideClick: false
        });
        forma.reset();
        this.areaCambioContrasena = false;
        this.loginService.setUser(this.usuario);        
      },err=>{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Ocurrio un error!!',
          allowOutsideClick: false
        });

      });
     
     
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Upsss..',
        text: 'Contraseña ACTUAL Incorrecta!!',
        allowOutsideClick: false
      });
      forma.reset();

    }
        
  }

}
