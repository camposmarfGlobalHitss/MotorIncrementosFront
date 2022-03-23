import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Regla } from '../classes/regla';
import { CalculoIncremento } from '../classes/calculo-incremento';
import { Exclusiones } from '../classes/exclusiones';

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

  extraccionCuentas():Observable<string>{
    return this.http.get('mit/reglas/extraccionCuentas',{responseType:'text'});
  }

  traerCuentasPostExtraccion():Observable<CalculoIncremento[]>{
    return this.http.get<CalculoIncremento[]>('mit/reglas/calculoIncrementoPostExtraccion');
  }

  traerCuentasCorregidas():Observable<CalculoIncremento[]>{
    return this.http.get<CalculoIncremento[]>('mit/reglas/calculoIncrementoCorregido');
  }

  validarCondicionesActuales():Observable<CalculoIncremento[]>{
    return this.http.get<CalculoIncremento[]>('mit/reglas/validarCondiciones')
  }

  pushFileToStorage(file: File,user:string): Observable<HttpEvent<{}>> {
    const data: FormData = new FormData();
    data.append('file', file);
    const newRequest = new HttpRequest('POST', `mit/calculo/guardarExclusiones/${user}`, data, {
    reportProgress: true,
    responseType: 'text'
    });
    return this.http.request(newRequest);
  }

  cargarExclusiones(file:File, user:string):Observable<Exclusiones[]>{
    const data: FormData = new FormData();
    data.append('file', file);
    return this.http.post<Exclusiones[]>(`mit/calculo/guardarExclusiones/${user}`,data);
  }

}
