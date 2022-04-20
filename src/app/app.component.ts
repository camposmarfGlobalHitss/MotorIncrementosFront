import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MotorIncrementos';

  constructor(){
    // localStorage.clear();
  }

  mostrarNavBar(){
    if(localStorage.getItem('usuario') ===null ){
      return false;
    }else{
      return false;
    }
  }

}
