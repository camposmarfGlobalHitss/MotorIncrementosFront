import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-verificar-usuario',
  templateUrl: './verificar-usuario.component.html',
  styleUrls: ['./verificar-usuario.component.css']
})
export class VerificarUsuarioComponent implements OnInit {
  estadoVerificacion:string = '';
  correo:string ='';
  mensajeVerificacion:string = '';
  opcionCorreccion:string ='';
  codigo:string='';
  constructor(public loginservice:LoginService, 
              public activedroute:ActivatedRoute,
              public router:Router) {
    this.activedroute.params.subscribe(params=>{
      this.codigo = params.codigo;      
    });

    this.loginservice.verificarUsuario(this.codigo).subscribe(data =>{
      if(data.username !== null){
        this.estadoVerificacion = 'USUARIO VERIFICADO CORRECTAMENTE';
        this.correo = data.correo;
        this.mensajeVerificacion = `Se ha verificado de manera correcta el usuario`;
        this.opcionCorreccion = '.'
      }else{
        this.estadoVerificacion = 'ERROR EN LA VERIFICACION';        
        this.mensajeVerificacion = `Error en la verificacion del usuario`;
        this.correo = ', '
        this.opcionCorreccion = 'por favor valide de nuevo el correo suministrado en el formulario'
      }
    });


   }

  ngOnInit(): void {
  }

  navegarLogin(){
    this.router.navigate(['/login'])
  }

}
