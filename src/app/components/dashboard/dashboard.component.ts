import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  usuario:UsuarioResponse
  usuarioLogueado:string = '';
  habConfiguracion:Boolean = false;
  constructor(public loginService:LoginService, 
              public router:Router) {
      if(localStorage.getItem('usuario')===null){
        this.router.navigate(['/login']);
      }else{
        if(this.loginService.UsuarioLogueado){
          this.usuario = this.loginService.UsuarioLogueado;
          this.usuarioLogueado = this.usuario.username;
          this.usuario.codperfil===1 ? this.habConfiguracion = true : this.habConfiguracion = false;
        }else{
          this.loginService.getLogin(localStorage.getItem('usuario')).subscribe(resp =>{
            this.usuario = resp
            this.usuarioLogueado = this.usuario.username;
            this.usuario.codperfil===1 ? this.habConfiguracion = true : this.habConfiguracion = false;
          })
        }
      }
      
      
      
   }

  ngOnInit(): void {
  }

  desloguear(){
    localStorage.clear();
    this.router.navigate(['login'])
  }

}
