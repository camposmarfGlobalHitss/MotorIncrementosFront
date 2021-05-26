import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-registro',
  templateUrl: './post-registro.component.html',
  styleUrls: ['./post-registro.component.css']
})
export class PostRegistroComponent implements OnInit {
  
  correo:string = '';
  constructor(public router:Router, public activateRouter: ActivatedRoute) {
    this.activateRouter.params.subscribe(params =>{     
      this.correo = params.correo;      
    })
   }

  ngOnInit(): void {
  }

  navegarInicio(){
    this.router.navigate(['/login']);
  }

}
