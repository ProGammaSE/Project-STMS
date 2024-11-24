package com.example.javabackend.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "tickets")
public class Tickets {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private int ticketId;

    @Column(name = "ticket_component")
    private int ticketComponent;

    @Column(name = "ticket_title")
    private String ticketTitle;

    @Column(name = "ticket_description")
    private String ticketDescription;

    @Column(name = "ticket_month")
    private int ticketMonth;

    @Column(name = "ticket_week")
    private int ticketWeek;
}
