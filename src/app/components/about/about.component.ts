import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  today:Date;
  constructor() { 
    this.today = new Date();
  }

  ngOnInit(): void {
  }

}
