import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuarioLogueado:string;
  iconOnlyToggled: boolean = false;
  sidebarToggled = false;

  @Output() iconOnly: EventEmitter<boolean> = new EventEmitter();
  
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  desloguear(){
    localStorage.clear();
    this.router.navigate(['login'])
  }

  toggleSidebar() {
    let body = document.querySelector('body');
    let dropdown = document.querySelector('#flotante');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      this.iconOnly.emit(this.iconOnlyToggled);
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
        dropdown.classList.add('menu-flotante')
      } else {
        body.classList.remove('sidebar-icon-only');     
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  /*toggleSidebar() {
    let body = document.querySelector('body');
    let collapse = document.querySelector('.collapse')
    let chevron = document.querySelector('#chevron')
    let texto = document.querySelectorAll('span')
    let title = document.querySelector('.title')
    let col = document.querySelector('.col-md-5')
    let itemsMenu = document.querySelectorAll('.items')
    this.iconOnlyToggled = !this.iconOnlyToggled;
    this.iconOnly.emit(this.iconOnlyToggled);
    if(this.iconOnlyToggled) {
      body.classList.add('sidebar-icon-only');
      if(collapse){
        collapse.classList.remove('show');
        chevron.classList.remove('collap');
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.remove('fa-chevron-down');
      }        
    } else {
      console.log('menu no colapsado')
      if(chevron.classList.contains('fa-chevron-up')){
        console.log('desde sidebar')
        body.classList.add('sidebar-icon-only'); 
        collapse.classList.remove('show');
        chevron.classList.remove('collap');
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.remove('fa-chevron-down');
        console.log(222)
        texto.forEach(m=> m.remove())
        title.remove();
        col.classList.remove('col-md-5');
        col.classList.add('col-md-12');
        itemsMenu.forEach(m=> m.classList.add('text-center'))
        return;
      }
      if(chevron.classList.contains('fas')){
        console.log('menu navbar')
        body.classList.remove('sidebar-icon-only');  
        chevron.classList.add('collap');
        chevron.classList.add('fa-chevron-down');
        itemsMenu.forEach(m=> m.classList.remove('text-center'))
        return;
      }
    }
  }*/

}
