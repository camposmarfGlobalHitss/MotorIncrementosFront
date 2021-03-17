import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { MonitoreoPlmComponent } from './components/monitoreo-plm/monitoreo-plm.component';
import { LoginGuard } from './guards/login.guard';
import { NoLoginGuard } from './guards/no-login.guard';
import { LoadingComponent } from './components/loading/loading.component';
import { BizComponent } from './components/biz/biz.component';

const ROUTES: Routes = [
    {path:'home', component:HomeComponent, canActivate: [LoginGuard] },
    {path:'login', component: LoginComponent, canActivate: [NoLoginGuard]},
    {path:'about', component: AboutComponent, canActivate: [LoginGuard]},
    {path:'monitoreo', component: MonitoreoPlmComponent, canActivate: [LoginGuard]},
    {path:'biz', component: BizComponent, canActivate: [LoginGuard]},
    {path:'**', pathMatch:'full', redirectTo:'biz'},
]
// , canActivate: [LoginGuard] esta es para home, about, monitoreo
// , canActivate: [NoLoginGuard] esta es para login
export const APP_ROUTING = RouterModule.forRoot(ROUTES);

