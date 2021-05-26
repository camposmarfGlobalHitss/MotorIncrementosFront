import { Component, OnInit } from '@angular/core';
import { Auditoria } from '../../classes/auditoria';
import { AuditoriaService } from '../../services/auditoria.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {

  pageActual:number=1;
  auditorias:Auditoria[]=[];
  filterTabla:string='';
  listTablasAuditoria:any = [];
  seleccionado:any;
  nombreArchivoExcel:string = "Rep_Auditoria.xlsx";
  loading:boolean=true;
  constructor(private auditService: AuditoriaService) { 
    this.auditService.getAuditoria().subscribe(resp =>{
      this.auditorias = resp;
      this.loading = false;
    });

    this.auditService.getListaTablasAuditoria().subscribe(resp=>{
      console.log(resp);
      this.listTablasAuditoria = resp;
    });
  }


  exportexcel(): void
  {
    
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.auditorias);
    ws['!cols'] = [
      {wpx: 36 },
      {wpx: 190},
      {wpx: 150},
      {wpx: 140},
      {wpx: 180},
      {wpx: 100}
    ];    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
 
    /* save to file */  
    XLSX.writeFile(wb, this.nombreArchivoExcel);
 
  }

  

  ngOnInit(): void {
  }

  filtroTabla(){    
    this.loading = true;
    if(this.seleccionado==='0'){
      this.auditService.getAuditoria().subscribe(resp =>{
        this.auditorias = resp;
        this.loading = false;
      });
    }else{
      this.auditService.getFiltroByTablas(this.seleccionado).subscribe(resp=>{
        this.auditorias = resp;
        this.loading = false;
      });
    }
  }

}
