import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsuarioResponse } from '../../interfaces/usuario-response';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

isMenuCollapsed: boolean;

  ngOnInit(){
  }

  onMenu(iconOnly){
    this.isMenuCollapsed = iconOnly;
  }

}
