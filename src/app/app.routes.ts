import { Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Coloque aquí todas las rutas que desea llamar en el sitio
import { HomeComponent } from "./components/home/home.component";
import { CitiesComponent } from "./components/cities/cities.component";
import { SellersComponent } from "./components/sellers/sellers.component";

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'cities', component: CitiesComponent },
    { path: 'sellers', component: SellersComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' } // Esta ruta se llama por defecto cuando las rutas configuradas anteriormente fallan
]; 

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);