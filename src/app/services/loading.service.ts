import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    
    private _loading: boolean = false;
    loadingStatus: Subject<boolean> = new Subject<boolean>();
    
    constructor() { }

    get loading(): boolean {
        return this._loading;
    }
    
    set loading(value: boolean) {
        this._loading = value;
        this.loadingStatus.next(value);
    }

    startLoading() {
        this.loading = true;
    }

    hideLoading() {
        this.loading = false;
    }

}