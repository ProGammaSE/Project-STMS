package com.example.javabackend.Repository;

import com.example.javabackend.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    Users getUsersByUserUsername(String userUsername);

    Users findByUserUsername(String userUsername);

    Users findByUserId(int userId);
}
