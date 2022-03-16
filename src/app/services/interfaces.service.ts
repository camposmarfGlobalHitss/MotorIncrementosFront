import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfacesService {

  constructor(private http:HttpClient) { }

  /*
    @Luz.Obredor 15.03.2022
    Se cambia tipo de dato del observable con el fin de descargar el archivo desde el consumo del servicio
  */
  generarRepCtasIncremento():Observable<Blob> {
    return this.http.get<Blob>('/mit/interfaces/genRepCtasIncremento',{responseType:'blob' as 'json'});
  }

  /*
    @Luz.Obredor 15.03.2022
    Se cambia tipo de dato del observable con el fin de descargar el archivo desde el consumo del servicio
  */
  generarRepCtasNoCumplenPoliticas():Observable<Blob>{
    return this.http.get<Blob>('/mit/interfaces/genRepCtasNoCumpPolInc',{responseType:'blob' as 'json'})
  }

  generarRepCtasSujIncremento():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtasSujInc',{responseType:'text'})
  }

  /*
    @Luz.Obredor 15.03.2022
    Se cambia tipo de dato del observable con el fin de descargar el archivo desde el consumo del servicio
  */
  generarRepCtasNoSujIncremento():Observable<Blob>{
    return this.http.get<Blob>('/mit/interfaces/genRepCtasNoSujInc',{responseType:'blob' as 'json'})
  }

  generarRepCtrlFyM():Observable<string>{
    return this.http.get('/mit/interfaces/genRepCtrlFyM',{responseType:'text'})
  }

  /*
    @Luz.Obredor 15.03.2022
    Se cambia tipo de dato del observable con el fin de descargar el archivo desde el consumo del servicio
  */
  generarInformePreIncremento():Observable<Blob>{
    return this.http.get<Blob>('/mit/interfaces/GenInfPreInc',{responseType:'blob' as 'json'});
  }

}

