import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { City } from 'src/shared/models/City.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  public port = 44338;
  public API = `http://${window.location.hostname}:${this.port}/api`;
  public citieslist: City[] = [];

  form: FormGroup;
  citiesInfo: City = { 
    Code: 0,
    Description: ''
  };

  constructor(
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.getAllCities();
  }

  public getAllCities() {
    this.http.get<City[]>(`${this.API}/City/GetAllCities`).subscribe(response => {
        //console.log(response);
        this.citieslist = response;
    });    
  }

  public getCityById(cityId:number){
    this.http.get<City>(`${this.API}/City/GetCityById?cityId=${cityId}`).subscribe(response => {
      console.log(response);
      this.citiesInfo = response;
    });
  }  

  public addNewCity(form: NgForm)
  {
    if(form.valid) 
    { 
      this.http.post<string>(`${this.API}/City/AddCity`, this.citiesInfo, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
      .subscribe({
        next: (response: string) => {
          console.log(response);
          Swal.fire({
            title: "¡Proceso exitoso!",
            text: "Se ha procesado el registro exitosamente.",
            icon: "success"            
          }).then((result) => {
            window.location.reload();
          });
        }, error: (error: HttpErrorResponse) => { 
          console.log(error);
          Swal.fire({
            title: "¡Lo sentimos!",
            text: error.message,
            icon: "error"
          });
        }
      });
    } else {
      Swal.fire( "Lo sentimos", "Aun faltan datos por diligenciar. Por favor revise.", "error" );
    }
  }

  // Función que actualiza la información de una ciudad específica
  public editCity(form: NgForm)
  {
    if(form.valid){
      this.http.put<string>(`${this.API}/City/UpdateCity`, this.citiesInfo, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
      .subscribe({
        next: (response: string) => {
          console.log(response);
          Swal.fire({
            title: "¡Proceso exitoso!",
            text: "Se ha procesado el registro exitosamente.",
            icon: "success"            
          }).then((result) => {
            window.location.reload();
          });
        }, error: (error: HttpErrorResponse) => { 
          console.log(error);
          Swal.fire({
            title: "¡Lo sentimos!",
            text: error.message,
            icon: "error"
          });
        }
      });
    } else {
      Swal.fire( "Lo sentimos", "Aun faltan datos por diligenciar. Por favor revise.", "error" );
    }
  }  
  
  // Función que elimina una ciudad específica
  public deleteCity(cityCode: number){
    Swal.fire({
      title: "¡Estas seguro!",
      text: "Una vez confirmado no se puede reversar la acción",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: 'Cancel'      
    }).then((result) => {
      if(result.isConfirmed){
        this.http.delete<string>(`${this.API}/City/DeleteCity?cityId=${cityCode}`).subscribe({
          next: (response: string) => {
            console.log(response);
            Swal.fire({
              title: "¡Proceso exitoso!",
              text: "Se ha realizado la acción exitosamente.",
              icon: "success"            
            }).then((result) => {
              window.location.reload();
            });
          }, error: (error: HttpErrorResponse) => { 
            console.log(error);
            Swal.fire({
              title: "¡Lo sentimos!",
              text: error.message,
              icon: "error"
            });
          }      
        });        
      }
    });
  }  
}
