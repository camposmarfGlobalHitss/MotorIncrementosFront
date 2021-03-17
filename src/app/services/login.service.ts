import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private hhtp:HttpClient) { }


  getLogin(user:string){
    return this.hhtp.get(`mit/usuarios?usuario=${user}`);
  }
}
