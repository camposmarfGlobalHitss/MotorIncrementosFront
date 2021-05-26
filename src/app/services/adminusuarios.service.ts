import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioResponse } from '../interfaces/usuario-response';

@Injectable({
  providedIn: 'root'
})
export class AdminusuariosService {

  constructor(private http: HttpClient) { }

  getUsuarios():Observable<UsuarioResponse[]>{
    return this.http.get<UsuarioResponse[]>('mit/admin/usuarios/getusuarios');
  }

  updateUsuario(usuario:UsuarioResponse){
    return this.http.post('mit/admin/usuarios/updateUsuario',usuario, {responseType:'text'} );
  }

  creeateUsuario(usuario:UsuarioResponse){
    return this.http.post('mit/admin/usuarios/createUsuario',usuario,{responseType: 'text'});
  }

}
