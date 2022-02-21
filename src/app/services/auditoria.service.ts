import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../classes/auditoria';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(private http: HttpClient) { }

  getAuditoria():Observable<Auditoria[]>{
      return this.http.get<Auditoria[]>('mit/auditoria/getAuditoria');
  }

  getListaTablasAuditoria(){
    return this.http.get('mit/auditoria/getTablasAuditoria');
  }

  getFiltroByTablas(tabla:string):Observable<Auditoria[]>{
    return this.http.get<Auditoria[]>(`mit/auditoria/getFiltroByTabla?tabla=${tabla}`);
  }
  /*
    @Luz.Obredor 10.02.2022
    Se crea servicio de creación de registro en tabla IMT_TBL_AUDITORIA
    Requiere el usuario que ejecutó la extracción
  */
  createAuditoriaCS(user: string){
    return this.http.get<Auditoria>(`mit/auditoria/guardarAuditoriaCS/${user}`);
  }
}
