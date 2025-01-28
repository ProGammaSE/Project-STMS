import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticketing } from '../Models/Ticketing';

@Injectable({
  providedIn: 'root'
})
export class TicketingService {

    BASE_URL = 'http://127.0.0.1:8081';
  
    constructor(private http: HttpClient) { }

    // Fucntion to create a new ticket
    createTicket(ticket: Ticketing) {
      return this.http.post(this.BASE_URL + '/ticket/create', ticket);
    }

    // Function to get all the saved tickets from the Database
    getAllTickets() {
      return this.http.get(this.BASE_URL + '/ticket/get/all');
    }

    // Function to delete a ticket from the Database
    deleteTicket(ticket: Ticketing) {
      return this.http.post(this.BASE_URL + '/ticket/delete', ticket);
    }
}
