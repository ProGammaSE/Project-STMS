import { Component } from '@angular/core';
import { Ticketing } from '../../Models/Ticketing';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GeneralResponse } from '../../Models/GeneralResponse';
import { Users } from '../../Models/Users';
import { TicketingService } from '../../Services/ticketing.service';
import { Router } from '@angular/router';
import { catchError, timeout } from 'rxjs';
import { tick } from '@angular/core/testing';

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
  allTickets: any = []
  formButtonText: string = "Create Ticket"

  constructor (private ticketService: TicketingService, private router: Router) {}

  ngOnInit() {
    this.getAllTickets();
  }

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
                location.reload()
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

  // Fucntion to get all the saved tickets from the databse
  getAllTickets() {
    this.ticketService.getAllTickets().subscribe((result: any) => {
      console.log(result)
      this.allTickets = result
    })
  }

  // Function to open the ticket in the form once the user click any ticket in the table
  editTableTicket(ticket: any) {
    // Show alert text
    alert("You are going to EDIT the ticket: " + ticket.ticketTitle)

    // Load the ticket into the form
    this.ticketing = ticket;

    // Change the text of the form button
    this.formButtonText = "Update Ticket"
  }

  // Function to delete the ticket once the user click any ticket in the table
  deleteTableTicket(ticket: any) {
    // Show alert text
    alert("You are going to DELETE the ticket: " + ticket.ticketTitle)

    // Delete
    this.ticketService.deleteTicket(ticket).subscribe((result: any) => {
      console.log(result)
      alert(result.message)
      location.reload();
    })
  }
}
