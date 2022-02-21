import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioResponse } from '../interfaces/usuario-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // lo ideal seria crear una interfaz de usuario para ponerle un tipado a la respuesta
  // se puede tomar la respuesta de postman y usar https://app.quicktype.io/ para 
  // para pasar la respuesta a una interfaz valida y asi facilitar el cogigo
  usuario:{
    username:'',
    descusuario:'',
    contrasena:'',
    fechausuario:'',
    estado:'',
    rol:''
  } 

  UsuarioLogueado:UsuarioResponse;
  constructor(private http:HttpClient) {

   }


  getLogin(user:string):Observable<UsuarioResponse>{
    return this.http.get<UsuarioResponse>(`/mit/usuarios?usuario=${user}`);
  }

  setUser(usuario:UsuarioResponse){
    
    this.UsuarioLogueado = usuario;
  }

  actualizarContrasena(usuario: UsuarioResponse){
      return this.http.put<UsuarioResponse>(`/mit/actualizarUsuario`,usuario);
  }

  crearUsuario(usuario:UsuarioResponse){   
    return this.http.post(`/mit/crearUsuario`,usuario);
  }

  verificarUsuario(codigo:string):Observable<UsuarioResponse>{
    return this.http.get<UsuarioResponse>(`/mit/verificarCodigo?codigo=${codigo}`);
  }

  olvidoPass(correo:string){
    return this.http.get(`/mit/olvidoPass?correo=${correo}`);
  }
}
