import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvido-pass',
  templateUrl: './olvido-pass.component.html',
  styleUrls: ['./olvido-pass.component.css']
})
export class OlvidoPassComponent implements OnInit {
  mensaje:string = '';
  respuesta:boolean=false;
  codigo:string='';
  usuario:UsuarioResponse ={};
  cambiopass:boolean;
  panelenviocorreo:boolean;
  constructor(public loginService:LoginService,
              public activatedRouter:ActivatedRoute,
              public router:Router) {
                this.panelenviocorreo = true;
             
    this.activatedRouter.params.subscribe(param=>{
      this.codigo = param.codigo;
    });

    if(this.codigo === '0'){
      this.respuesta = false;    
    }else{
      this.loginService.verificarUsuario(this.codigo).subscribe(data=>{
        if(data.id !== null){
          this.usuario = data;
          this.cambiopass = true;
          this.panelenviocorreo = false;
          
        }else{
          this.mensaje = 'usuario no existe';
        }
      },err=>{
        this.mensaje = 'Usuario no existe'
      });

      
      
    }
  }

  ngOnInit(): void {
  }

  recuperarIngreso(email:string){
    
      Swal.fire({
        icon: 'info',
        title: 'Espere...',
        text: 'Validando Informacion!',
        allowOutsideClick: false
      });
  
      Swal.showLoading();
    console.log(email);
    this.loginService.olvidoPass(email).subscribe(resp=>{      
      console.log(resp);    
      if(resp){
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Correo enviado correctamente!!',
          allowOutsideClick: false
        });
        this.mensaje = 'Se ha enviado un correo de recuperacion, por favor ingrese a su correo y de clic en el enlace de recuperacion';
        this.respuesta = true;        
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Upsss..',
          text: 'Usuario no existe valide e intente de nuevo!',
          allowOutsideClick: false
        });
        this.mensaje = 'usuario no existe por favor valide el correo suministrado e intente de nuevo'
        this.respuesta = true;        
      }
    })
    
  }


  guardarContrasena( forma:NgForm){
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: 'Validando Informacion!',
      allowOutsideClick: false
    });

    Swal.showLoading();
      if(forma.controls.confirmacionpass.value === forma.controls.nuevopass.value){
        this.usuario.contrasena = forma.controls.confirmacionpass.value;
      this.loginService.actualizarContrasena(this.usuario).subscribe ( resp=>{
        console.log(resp);
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Contraseña Cambiada Correctamente!!',
          allowOutsideClick: false
        });
        forma.reset();
        this.router.navigate(['/login']);
               
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
          text: 'Contraseñas no coinciden!!',
          allowOutsideClick: false
        });
        forma.reset();
      }
      
     
     
    
        
  }

}
