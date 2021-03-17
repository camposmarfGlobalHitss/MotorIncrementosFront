import { Component, OnInit } from '@angular/core';
import { MonitoreoService } from '../../services/monitoreo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private monitoreo:MonitoreoService) { }

  ngOnInit(): void {
  }

}
