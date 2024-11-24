package com.example.javabackend.Controller;

import com.example.javabackend.Model.GeneralResponse;
import com.example.javabackend.Model.Tickets;
import com.example.javabackend.Service.TicketService;
import org.springframework.web.bind.annotation.*;

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
}
