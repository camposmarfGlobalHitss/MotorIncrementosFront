import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  
  today: Date;
  sidebar: any;

  constructor() { 
    this.today = new Date();
    this.sidebar = document.querySelector('#sidebar-container');         
    this.sidebar.classList.add('height-nav')
  }

  ngOnInit(): void {
  }

}
