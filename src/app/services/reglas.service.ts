import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Regla } from '../classes/regla';

@Injectable({
  providedIn: 'root'
})
export class ReglasService {

  constructor(private http:HttpClient) { }


  getCondicionesActuales():Observable<string>{
    return this.http.get('mit/reglas/condicionesActuales',{responseType:'text'});
  }

  chequearCondicion(condicion:string):Observable<string>{
    return this.http.get(`mit/reglas/chequearCondicion?condicion=${condicion}`,{responseType: 'text'});
  }

  crearCondicion(regla:Regla){
    return this.http.post('mit/reglas/crearCondicion',regla);
  }

  listarCondiciones():Observable<Regla[]> {
    return this.http.get<Regla[]>('mit/reglas/listarCondiciones');
  }

  actualizarCondicion(regla:Regla):Observable<string>{
    return this.http.post('mit/reglas/actualizarCondicion',regla,{responseType:'text'});
  }

  borrarCondicion(id:number):Observable<string>{
    return this.http.delete(`mit/reglas/borrarCondicion?id=${id}`,{responseType:'text'})
  }
}
