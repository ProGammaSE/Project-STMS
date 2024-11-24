package com.example.javabackend.Repository;

import com.example.javabackend.Model.Tickets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Tickets, Integer> {
}
