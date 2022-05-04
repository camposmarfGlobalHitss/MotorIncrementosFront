import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loading = false;
  loadingSuscription: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnDestroy(): void {
    this.loadingSuscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSuscription = this.loadingService.loadingStatus.subscribe((value: boolean) => {
      this.loading = value;
    });
  }

}
