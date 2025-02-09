import { Component } from '@angular/core';
import { Ticketing } from '../../Models/Ticketing';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { GeneralResponse } from '../../Models/GeneralResponse';
import { Users } from '../../Models/Users';
import { TicketingService } from '../../Services/ticketing.service';
import { catchError, timeout } from 'rxjs';
import { PredictService } from '../../Services/predict.service';
import { Train } from '../../Models/Train';

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
  trainRequest: Train = new Train();
  newDatasetSize: string = ""

  constructor (private ticketService: TicketingService, private predictService: PredictService) {}

  ngOnInit() {
    this.newDatasetSize = localStorage.getItem("datasetSize") || "";
    this.getAllTickets();
  }

  // Fucntion to create a new ticket
  createTicket() {
    this.loadingBox = true;

    // Validate user inputs
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

        try {
          this.ticketService.createTicket(this.ticketing).pipe(
            timeout(15000),
            catchError(err => {
              return err;
            })
          ).subscribe ((result: any) => {
            this.generalResponse = result;

            if (this.generalResponse.response == 200) {

              // Train the model with new ticket data
              // Assign ticket details to add to the dataset
              this.trainRequest.month = this.ticketing.ticketMonth
              this.trainRequest.week = this.ticketing.ticketWeek
              this.trainRequest.component = this.ticketing.ticketComponent

              this.predictService.datasetWrite(this.trainRequest).subscribe((writeResult: any) => {
                console.log(writeResult)

                if (writeResult.status == 200) {
                  // Stote the new dataset size in the browser local storage
                  localStorage.setItem("datasetSize", writeResult.size)

                  this.loadingBox = false;
                  this.alertStatus = true
                  this.alertClass = "alert alert-success"
                  this.alertText = this.generalResponse.message
  
                  setTimeout(() => {
                    this.alertStatus = false
                    this.loadingBox = false;
                    this.ticketing = new Ticketing();
                    console.log("New dataset size: " + localStorage.getItem("datasetSize"))
                    location.reload()
                  }, 3000);
                }

                // If failed when training the model
                else {
                  this.loadingBox = false;
                  this.alertStatus = true
                  this.alertClass = "alert alert-danger"
                  this.alertText = "Model not trained. Please try again!"
              
                  setTimeout(() => {
                    this.alertStatus = false
                    this.loadingBox = false;
                    this.ticketing = new Ticketing();
                  }, 3000);
                }
              })
            }

            // If failed when saving the ticket data in the Database
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
        } catch {
          this.loadingBox = false;
          this.alertStatus = true
          this.alertClass = "alert alert-danger"
          this.alertText = "Model not trained. Please try again!"
      
          setTimeout(() => {
            this.alertStatus = false
            this.loadingBox = false;
            this.ticketing = new Ticketing();
          }, 3000);
        }
       }
  }

  // Function to train the model using the dataset
  trainModel() {
    this.loadingBox = true;

    this.predictService.trainModel().subscribe((result: any) => {
      this.loadingBox = false;
      this.alertStatus = true
      this.alertClass = "alert alert-success"
      this.alertText = "Model trained successfully"
  
      setTimeout(() => {
        this.alertStatus = false
        this.loadingBox = false;
      }, 3000);
    })
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
