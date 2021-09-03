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
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { OlvidoPassComponent } from './components/olvido-pass/olvido-pass.component';
import { VerificarUsuarioComponent } from './components/verificar-usuario/verificar-usuario.component';
import { PostRegistroComponent } from './components/post-registro/post-registro.component';
import { ExtraccionInformacionComponent } from './components/extraccion-informacion/extraccion-informacion.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { SeguridadComponent } from './components/seguridad/seguridad.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FiltroTablasPipe } from './pipes/filtro-tablas.pipe';
import { BizService } from './services/biz.service';
import { ExtraccionInformacionService } from './services/extraccion-informacion.service';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReglasExtraccionComponent } from './components/reglas-extraccion/reglas-extraccion.component';
import { GeneracionReglasComponent } from './components/generacion-reglas/generacion-reglas.component';
import { AdminusuariosService } from './services/adminusuarios.service';
import { ReglasService } from './services/reglas.service';
import { CalculoIncrementoComponent } from './components/calculo-incremento/calculo-incremento.component';
import { FilteridclientePipe } from './pipes/filteridcliente.pipe';
import { FilteridenclientePipe } from './pipes/filteridencliente.pipe';
import { FilterrefPipe } from './pipes/filterref.pipe';
import { ParametrizacionCalculoComponent } from './components/parametrizacion-calculo/parametrizacion-calculo.component';
import { FrontCalculoComponent } from './components/front-calculo/front-calculo.component';
import { CalculoincrementoService } from './services/calculoincremento.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    LoadingComponent,
    MonitoreoPlmComponent,
    BizComponent,
    DashboardComponent,
    AboutComponent,
    PerfilComponent,
    RegistroComponent,
    OlvidoPassComponent,
    VerificarUsuarioComponent,
    PostRegistroComponent,
    ExtraccionInformacionComponent,
    ConfiguracionComponent,
    SeguridadComponent,
    AuditoriaComponent,
    FiltroTablasPipe,
    AdminUsuariosComponent,
    ReglasExtraccionComponent,
    GeneracionReglasComponent,
    CalculoIncrementoComponent,
    ParametrizacionCalculoComponent,
    FrontCalculoComponent,
    FilteridclientePipe,
    FilteridenclientePipe,
    FilterrefPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    APP_ROUTING,
    CommonModule,
    NgxPaginationModule,
    NgbModule
  ],exports:[
  
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoginGuard,
    NoLoginGuard,
    MonitoreoService,
    LoginService,
    BizService,
    ExtraccionInformacionService,
    AdminusuariosService,
    ReglasService,
    CalculoincrementoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
