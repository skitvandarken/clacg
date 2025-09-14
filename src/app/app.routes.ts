import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { DeclaracaoComponent } from './paginas/declaracao/declaracao.component';

export const routes: Routes = [

    { path:'', component: InicioComponent},
    {path:'declaracao', component: DeclaracaoComponent}
];
