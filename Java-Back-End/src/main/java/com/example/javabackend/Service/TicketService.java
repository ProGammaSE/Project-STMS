package com.example.javabackend.Service;

import com.example.javabackend.Model.GeneralResponse;
import com.example.javabackend.Model.Tickets;
import com.example.javabackend.Repository.TicketRepository;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // function create a new ticket to the database
    public GeneralResponse createTicket(Tickets ticket) {
        GeneralResponse generalResponse = new GeneralResponse();

        // checking whether the mandatory data are available
        if (ticket.getTicketComponent() == 0 || ticket.getTicketTitle().isEmpty() || ticket.getTicketMonth() == 0 || ticket.getTicketWeek() == 0) {
            generalResponse.setResponse(400);
            generalResponse.setMessage("Mandatory data are not available");
        }
        else {
            try {
                Tickets dbTicket = ticketRepository.save(ticket);
                generalResponse.setResponse(200);
                generalResponse.setMessage("Ticket created successfully");
                generalResponse.setData(dbTicket);
            } catch (Exception ex) {
                generalResponse.setResponse(400);
                generalResponse.setMessage("Something went wrong!");
            }
        }
        return generalResponse;
    }

    // function to get ticket details by its ID
    public GeneralResponse getTicket(int ticketId) {
        GeneralResponse generalResponse = new GeneralResponse();

        // check whether the ticket id is available
        if (ticketId == 0) {
            generalResponse.setResponse(400);
            generalResponse.setMessage("Mandatory data are not available");
        }
        else {

        }
        return generalResponse;
    }
}
