import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Biz } from '../interfaces/biz';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BizService {

  constructor(private http:HttpClient) { }
  
  headers:{
    "Content-Type":"application/json"
  }
  getBiz(biz:Biz){
    let jsonMessage = JSON.stringify(biz);
    const parametros = '?transactionId=transactionId45&system=system46&user=user47&password=password4&requestDate=2018-05-21T16:39:28.781&ipApplication=ipApplication49&traceabilityId=traceabilityId50&HeaderRequest.target= '
    let headers = new HttpHeaders().set('Content-Type','application/json')
    return this.http.put(`BIZInteractions/Rest/V1.0/BizInteractionsApi/put/setPresencialBizInteraction/${jsonMessage}${parametros}`,{headers:headers});
  }

  getListaIncrementados():Observable<string[]>{
    return this.http.get<string[]>('/mit/Biz/getListaIncrementados');
  }
  

}
