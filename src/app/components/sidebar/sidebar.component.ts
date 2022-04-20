import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioResponse } from 'src/app/interfaces/usuario-response';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  usuario:UsuarioResponse;
  usuarioLogueado:string = '';
  habConfiguracion:Boolean = false;
  isCollapsed = true;
  uiBasicCollapsed = false;

  @Input() isMenuCollapsed : boolean;

  constructor(public loginService: LoginService,
    public router: Router) {
    if (localStorage.getItem('usuario') === null) {
      this.router.navigate(['/login']);
    } else {
      if (this.loginService.UsuarioLogueado) {
        this.usuario = this.loginService.UsuarioLogueado;
        this.usuarioLogueado = this.usuario.username;
        this.usuario.codperfil === 1 ? this.habConfiguracion = true : this.habConfiguracion = false;
      } else {
        this.loginService.getLogin(localStorage.getItem('usuario')).subscribe(resp => {
          this.usuario = resp
          this.usuarioLogueado = this.usuario.username;
          this.usuario.codperfil === 1 ? this.habConfiguracion = true : this.habConfiguracion = false;
        })
      }
    }
  }

  ngOnInit(): void {
  }

  ejecucionIncremento() {
    this.router.navigateByUrl(`/dashboard/calculoIncremento/ejecucion/${0}`);
  }

  interfacesIncremento() {
    this.router.navigateByUrl(`/dashboard/calculoIncremento/interfaces/${0}`);
  }

  /*toggleSidebar() {
    console.log(111, this.isMenuCollapsed)
    let body = document.querySelector('body');     
    let collapse = document.querySelector('.collapse');
    let chevron = document.querySelector('#chevron')
    this.isCollapsed = !this.isCollapsed;
    if(this.isMenuCollapsed) {
      console.log(2)
      body.classList.remove('sidebar-icon-only');
      collapse.classList.remove('show');
      chevron.classList.remove('fa-chevron-down');
      this.isMenuCollapsed = false;    
      this.isCollapsed = false;  
      if(!body.classList.contains('sidebar-icon-only')){
        collapse.classList.add('show');
        chevron.classList.add('fas');
        chevron.classList.add('collap');
        chevron.classList.add('fa-chevron-down');
        return;
      }        
    }else{
      collapse.classList.remove('show');
      chevron.classList.remove('fa-chevron-down');
      return;
    }
    if(!body.classList.contains('sidebar-icon-only') && this.isCollapsed){
      console.log(3)
      collapse.classList.add('show');
    }
    if(!body.classList.contains('sidebar-icon-only') && !this.isCollapsed){
      console.log(4)
      collapse.classList.remove('show');
    }  
  }*/

  toggleSidebar() {
    let body = document.querySelector('body');     
    let collapse = document.querySelector('.collapse');
    this.isCollapsed = !this.isCollapsed;
    if(body.classList.contains('sidebar-icon-only')){
      this.isCollapsed = true;
    }
    if(!body.classList.contains('sidebar-icon-only') && this.isCollapsed){
      collapse.classList.add('show');
    }
    if(!body.classList.contains('sidebar-icon-only') && !this.isCollapsed){
      collapse.classList.remove('show');
    }  
  }

}