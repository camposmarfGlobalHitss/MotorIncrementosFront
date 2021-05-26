import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../classes/auditoria';

@Injectable({
  providedIn: 'root'
})
export class ExtraccionInformacionService {

  constructor(private http:HttpClient) { }


  traerInformacion():Observable<Auditoria[]>{
    return this.http.get<Auditoria[]>('mit/extractInfo/statsExtraccion');
  }

  extraccionClientes():Observable<string>{
    return this.http.get('mit/extractInfo/extractInfoClientes',{responseType: 'text'})
  }

  extraccionProductoOferta():Observable<string>{
    return this.http.get('mit/extractInfo/extractInfoProductoOFerta',{responseType: 'text'});
  }
}
