import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

///Routes
import { APP_ROUTING } from './app.router.module';

//Services
import { MonitoreoService } from './services/monitoreo.service';
import { LoginService } from './services/login.service';


//modules add
import { HttpClientModule } from "@angular/common/http";


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginGuard } from './guards/login.guard';
import { NoLoginGuard } from './guards/no-login.guard';
import { LoadingComponent } from './components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MonitoreoPlmComponent } from './components/monitoreo-plm/monitoreo-plm.component';
import { BizComponent } from './components/biz/biz.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    LoadingComponent,
    MonitoreoPlmComponent,
    BizComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    APP_ROUTING,
    CommonModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoginGuard,
    NoLoginGuard,
    MonitoreoService,
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
