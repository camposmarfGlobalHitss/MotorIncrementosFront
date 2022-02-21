import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileStorageService {

    constructor(private http: HttpClient) { }

    /*
        @Luz.Obredor 14.02.2022
        Esta función permite la carga de archivo en el servidor de aplicaciones
        recibe como parámetro el archivo a cargar
    */
    uploadFile(file: File){   
        const data: FormData = new FormData();
        data.append('file', file);
        return this.http.post<any>(`mit/file/upload`,data);
    }    

    /*
        @Luz.Obredor 15.02.2022
        Esta función permite consumir el job que actualiza los estados de los registro a exitoso o rechazado
    */
    executeJob():Observable<string>{
        return this.http.get('mit/file/executeJob', {responseType: 'text'});
    }

}