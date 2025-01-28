package com.example.javabackend.Controller;

import com.example.javabackend.Model.GeneralResponse;
import com.example.javabackend.Model.Tickets;
import com.example.javabackend.Service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // create a new ticket
    @PostMapping(value = "/ticket/create")
    public GeneralResponse createTicket(@RequestBody Tickets ticket) {
        return ticketService.createTicket(ticket);
    }

    // get ticket details by ID
    @GetMapping(value = "/ticket/get/{ticketId}")
    public GeneralResponse getTicket(@PathVariable int ticketId) {
        return ticketService.getTicket(ticketId);
    }

    // get all the tickets
    @GetMapping(value = "/ticket/get/all")
    public List<Tickets> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // edit ticket
    @PutMapping(value = "/ticket/update")
    public GeneralResponse updateTicket(@RequestBody Tickets ticket) {
        return ticketService.updateTicket(ticket);
    }

    // delete ticket
    @PostMapping(value = "/ticket/delete")
    public GeneralResponse deleteTicket(@RequestBody Tickets ticket) {
        return ticketService.deleteTicket(ticket);
    }
}
