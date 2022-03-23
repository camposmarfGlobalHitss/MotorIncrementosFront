import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovilRangoIncremento } from '../classes/movil-rango-incremento';
import { ParametrosIncrementoFija } from '../classes/parametros-incremento-fija';
import { Uvts } from '../classes/uvts';
import { ParametrosCalculoMovil } from '../classes/parametros-calculo-movil';
import { ParametrosCalculoFija } from '../classes/parametros-calculo-fija';

@Injectable({
  providedIn: 'root'
})
export class CalculoincrementoService {

  constructor(private http:HttpClient) { }


  obtenerMovilRangoIncremento():Observable<MovilRangoIncremento[]>{
    return this.http.get<MovilRangoIncremento[]>('mit/calculo/obtenerMovilRangosIncrementos');
  }

  guardarMovilRangoIncremento(movilRango:MovilRangoIncremento,user:string):Observable<string>{
      return this.http.post(`mit/calculo/guardarMovilRangoIncremento?user=${user}`,movilRango,{responseType:'text'});
  }

  borrarMovilRangoIncremento(movilRango:MovilRangoIncremento):Observable<string>{
    // return this.http.post<string>('mit/calculo/borrarMovilRangoIncremento',movilRango,{responseType:'text'});
    return this.http.post('mit/calculo/borrarMovilRangoIncremento',movilRango,{responseType:'text'});

  }

  obtenerParametrosIncrementoFija():Observable<ParametrosIncrementoFija[]>{
    return this.http.get<ParametrosIncrementoFija[]>('mit/calculo/obtenerParametrosIncrementoFija');
  }


  guardarParametrosIncremento(pif:ParametrosIncrementoFija, user:string):Observable<string>{
    return this.http.post(`mit/calculo/guardarParametrosIncrementoFija?user=${user}`,pif,{responseType:'text'})
  }                                    
  
  borrarParametrosIncrementoFija(pif:ParametrosIncrementoFija):Observable<string>{
    return this.http.post('mit/calculo/borrarParametrosIncrementoFija',pif,{responseType:'text'});
  }

  obtenerValoresUvts():Observable<Uvts[]>{
    return this.http.get<Uvts[]>('mit/calculo/obtenerValoresUvts');
  }

  guardarUvt(uvt:Uvts, user:string):Observable<string>{
    return this.http.post(`mit/calculo/guardarUvt?user=${user}`,uvt,{responseType:'text'});
  }

  borrarValorUvt(uvt:Uvts):Observable<string>{
    return this.http.post('mit/calculo/borrarValorUvt',uvt,{responseType:'text'});
  }

  ultimaActualizacionProductoSubtipoOferta():Observable<string>{
    return this.http.get('mit/calculo/obtenerUltimaActualizacionProductoSubtipoOferta',{responseType:'text'});
  }

  ActualizacionPSO(user:string):Observable<string>{
    return this.http.get(`mit/calculo/ActualizacionPSO?user=${user}`,{responseType:'text'})
  }

  ejecutarCalculoIncrementoMovil(calculoMovil:ParametrosCalculoMovil):Observable<string>{
    return this.http.post('mit/calculo/ejecutarCalculoIncrementoMovil',calculoMovil,{responseType:'text'});
  }

  ejecutarCalculoIncrementoFija(calculoFija:ParametrosCalculoFija):Observable<string>{
    return this.http.post('mit/calculo/ejecutarCalculoIncrementoFija',calculoFija,{responseType:'text'})
  }


  generarArchivoPlanoPLM():Observable<string>{
    return this.http.get('mit/calculo/generarArchivoPLM',{responseType:'text'})
  }

  /* 
    @Luz.Obredor 22.03.2022
    Consumo del servicio que genera el archivo de entrada a ericsson PLM por reinyección
  */
  generarArchivoPlanoPLMCorregido():Observable<string>{
    return this.http.get('mit/calculo/generarArchivoPLMCorregido',{responseType:'text'})
  }

}
