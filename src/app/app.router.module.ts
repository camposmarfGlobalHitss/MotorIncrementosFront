import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { MonitoreoPlmComponent } from './components/monitoreo-plm/monitoreo-plm.component';
import { LoginGuard } from './guards/login.guard';
import { NoLoginGuard } from './guards/no-login.guard';
import { LoadingComponent } from './components/loading/loading.component';
import { BizComponent } from './components/biz/biz.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ExtraccionInformacionComponent } from './components/extraccion-informacion/extraccion-informacion.component';
import { PostRegistroComponent } from './components/post-registro/post-registro.component';
import { VerificarUsuarioComponent } from './components/verificar-usuario/verificar-usuario.component';
import { OlvidoPassComponent } from './components/olvido-pass/olvido-pass.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { SeguridadComponent } from './components/seguridad/seguridad.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { ReglasExtraccionComponent } from './components/reglas-extraccion/reglas-extraccion.component';
import { GeneracionReglasComponent } from './components/generacion-reglas/generacion-reglas.component';
import { CalculoIncrementoComponent } from './components/calculo-incremento/calculo-incremento.component';
import { ParametrizacionCalculoComponent } from './components/parametrizacion-calculo/parametrizacion-calculo.component';
import { FrontCalculoComponent } from './components/front-calculo/front-calculo.component';
import { InterfacesComponent } from './components/interfaces/interfaces.component';
import { ReinyeccionComponent } from './components/reinyeccion/reinyeccion.component';
import { EjecucionIncrementoComponent } from './components/ejecucion-incremento/ejecucion-incremento.component';


const ROUTES: Routes = [
    // {path:'home', component:HomeComponent  },
    {path:'login', component: LoginComponent},
    {path:'registro', component: RegistroComponent},
    {path:'postregistro/:correo', component:PostRegistroComponent},
    {path:'verificarUsuario/:codigo', component:VerificarUsuarioComponent},
    {path:'olvidoPass/:codigo', component:OlvidoPassComponent},
    // {path:'about', component: AboutComponent },
    // {path:'monitoreo', component: MonitoreoPlmComponent},
    // {path:'biz', component: BizComponent },
    {path:'dashboard', component: DashboardComponent,
    children:[
        {path:'', component:HomeComponent},
        {path:'about', component: AboutComponent },
        {path:'monitoreo', component: MonitoreoPlmComponent},
        {path:'biz', component: BizComponent },
        {path:'perfil', component: PerfilComponent },
        {path:'extraccion', component: ExtraccionInformacionComponent },
        {path:'reglas', component: ReglasExtraccionComponent },
        {path:'creareglas', component: GeneracionReglasComponent },
        {path:'calculoIncremento', component: FrontCalculoComponent, children:[
            {path:'calculo/:parametrizacion', component:CalculoIncrementoComponent},
            {path:'parametrizacion', component:ParametrizacionCalculoComponent},
            {path:'ejecucion/:parametro', component: EjecucionIncrementoComponent},
            {path:'interfaces', component:InterfacesComponent},
            {path:'**', redirectTo:'calculo' },
            {path:'reinyeccion', component: ReinyeccionComponent}
            ] },
        {path:'configuracion', component: ConfiguracionComponent},
        {path:'auditoria', component: AuditoriaComponent},
        {path:'seguridad', component: SeguridadComponent},
        {path:'adminusuarios', component: AdminUsuariosComponent},
        ]
    },
    {path:'**', pathMatch:'full', redirectTo:'login'},
]
// , canActivate: [LoginGuard] esta es para home, about, monitoreo
// , canActivate: [NoLoginGuard] esta es para login y para registro
export const APP_ROUTING = RouterModule.forRoot(ROUTES);

