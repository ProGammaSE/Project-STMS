import { Component } from '@angular/core';
import { Ticketing } from '../../Models/Ticketing';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GeneralResponse } from '../../Models/GeneralResponse';
import { Users } from '../../Models/Users';
import { TicketingService } from '../../Services/ticketing.service';
import { Router } from '@angular/router';
import { catchError, timeout } from 'rxjs';

@Component({
  selector: 'app-ticketing-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './ticketing-page.component.html',
  styleUrl: './ticketing-page.component.css'
})
export class TicketingPageComponent {

  // Global variables
  ticketing: Ticketing = new Ticketing();
  loadingBox: boolean = false;
  alertStatus: boolean = false;
  alertClass: string = "";
  alertText: string = "";
  confirmPassword: string = "";
  register : Users = new Users;
  loggedUser : Users = new Users;
  generalResponse: GeneralResponse = new GeneralResponse;

  constructor (private ticketService: TicketingService, private router: Router) {}

  // Fucntion to create a new ticket
  createTicket() {
    this.loadingBox = true;

    if (this.ticketing.ticketComponent == 0 || this.ticketing.ticketTitle == "" || this.ticketing.ticketDescription == "" ||
       this.ticketing.ticketMonth == 0 || this.ticketing.ticketWeek == 0) {

        this.loadingBox = false;
        this.alertStatus = true
        this.alertClass = "alert alert-danger"
        this.alertText = "Mandatory details cannot be empty"
    
        setTimeout(() => {
          this.alertStatus = false
          this.loadingBox = false;
        }, 3000);

       }
       else {
          this.ticketService.createTicket(this.ticketing).pipe(
            timeout(10000),
            catchError(err => {
              return err;
            })
          ).subscribe ((result: any) => {
            this.generalResponse = result;

            if (this.generalResponse.response == 200) {
              this.loadingBox = false;
              this.alertStatus = true
              this.alertClass = "alert alert-success"
              this.alertText = this.generalResponse.message
          
              setTimeout(() => {
                this.alertStatus = false
                this.loadingBox = false;
                this.ticketing = new Ticketing();
              }, 3000);
            }
            else {
              this.loadingBox = false;
              this.alertStatus = true
              this.alertClass = "alert alert-danger"
              this.alertText = this.generalResponse.message
          
              setTimeout(() => {
                this.alertStatus = false
                this.loadingBox = false;
                this.ticketing = new Ticketing();
              }, 3000);
            }
          })
       }
  }
}
