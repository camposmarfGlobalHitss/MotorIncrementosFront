import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfacesService {

  constructor(private http:HttpClient) { }

  generarRepCtasIncremento():Observable<string> {
    return this.http.get('/mit/interfaces/genRepCtasIncremento',{responseType:'text'});
  }

  generarRepCtasNoCumplenPoliticas():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtasNoCumpPolInc',{responseType:'text'})
  }

  generarRepCtasSujIncremento():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtasSujInc',{responseType:'text'})
  }

  generarRepCtasNoSujIncremento():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtasNoSujInc',{responseType:'text'})
  }

  generarRepCtrlFyM():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtrlFyM',{responseType:'text'})
  }

  generarInformePreIncremento():Observable<string>{
    return this.http.get('/mit/interfaces/GenInfPreInc',{responseType:'text'});
  }

}

