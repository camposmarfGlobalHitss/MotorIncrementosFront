import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  constructor(private http: HttpClient) { 
    
  }

  getInformacionMonitoreo(batchId:string){
    return this.http.get(`MassiveOrderSummary/V1.0/getMassiveOrderSummary?action=batchSummary&batchId=${batchId}&showDetails=true&detailStarRow=0&detailPageSize=35&startDate=2019-10-07T10:10:10-05:00&channel=USSD&idApplication=1234`)
    
  }
}
