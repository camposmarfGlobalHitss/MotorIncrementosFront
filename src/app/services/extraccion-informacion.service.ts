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

  /*
    @Luz.Obredor 10.02.2022
    Se crea servicio para poblar tabla IMT_TBL_CONTRATOS con la extracción de contratos de BD BSCS
    No requiere parámetros
  */
  extraccionContratos():Observable<string>{
    return this.http.get('mit/extractInfo/extractInfoContratos',{responseType: 'text'})
  }

  extraccionProductoOferta():Observable<string>{
    return this.http.get('mit/extractInfo/extractInfoProductoOFerta',{responseType: 'text'});
  }

  /*
    @Luz.Obredor 10.02.2022
    Se crea servicio de poblado de tabla IMT_TBL_TARIFAS_USO con la extracción de charging system
    No requiere parámetros
  */
  extraccionCsOffers():Observable<string>{
    return this.http.get('mit/extractInfo/extractCsOffers',{responseType: 'text'});
  }
}
