import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Seller } from 'src/shared/models/Seller.model';
import { City } from 'src/shared/models/City.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit {

  modalTitle = '';
  public port = 44338;
  public API = `http://${window.location.hostname}:${this.port}/api`;
  public sellerlist: Seller[] = [];
  public citieslist: City[] = [];

  @ViewChild('addModal') addModal: ElementRef;
  @ViewChild('editModal') editModal: ElementRef;

  form: FormGroup;
  sellerInfo: Seller = { 
    Code: 0,
    Name: '',
    Lastname: '',
    DocNumber: '',
    CityCode: -1,
    CityName: ''   
  };

  constructor(
    private http: HttpClient
  ) {

  }

  ngOnInit(): void {
    this.getAllSeller();
    this.getCities();
  }
  
  public getAllSeller() {
    this.http.get<Seller[]>(`${this.API}/Seller/GetAllSeller`).subscribe(response => {
        //console.log(response);
        this.sellerlist = response;
    });    
  }

  public getCities() {
    this.http.get<City[]>(`${this.API}/City/GetAllCities`).subscribe(response => {
        //console.log(response);
        this.citieslist = response;
    });    
  }

  public getSellerById(sellerId:number){
    this.http.get<Seller>(`${this.API}/Seller/GetSellerById?sellerId=${sellerId}`).subscribe(response => {
      console.log(response);
      this.sellerInfo = response;
    });
  }

  public addNewSeller(form: NgForm)
  {
    this.resetForm('SltCities');

    if(form.valid){ 
      this.addModal.nativeElement.click();

      this.http.post<string>(`${this.API}/Seller/AddSeller`, this.sellerInfo, {
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

  // Función que actualiza la información de un vendedor específico
  public editSeller(form: NgForm)
  {
    this.resetForm('SltEditCities');
    this.editModal.nativeElement.click();

    if(form.valid){
      this.http.put<string>(`${this.API}/Seller/UpdateUser`, this.sellerInfo, {
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

  // Función que elimina un vendedor
  public deleteSeller(sellerCode: number){
    Swal.fire({
      title: "¡Estas seguro!",
      text: "Una vez confirmado no se puede reversar la acción",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: 'Confirm',
      denyButtonText: 'Cancel'      
    }).then((result) => {
      if(result.isConfirmed){
        this.editModal.nativeElement.click();
        this.http.delete<string>(`${this.API}/Seller/DeleteSeller?sellerId=${sellerCode}`).subscribe({
          next: (response: string) => {
            console.log(response);
            Swal.fire({
              title: "¡Proceso exitoso!",
              text: "Se ha realizado la acción exitosamente.",
              icon: "success"            
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

  // Función que limpia el formulario
  private resetForm(selectId: string){
    const inputs = document.querySelectorAll('input');
    (document.getElementById(selectId) as HTMLSelectElement).options.selectedIndex = 0;
    inputs.forEach(input => { input.value = ''; }); 
  }

}
