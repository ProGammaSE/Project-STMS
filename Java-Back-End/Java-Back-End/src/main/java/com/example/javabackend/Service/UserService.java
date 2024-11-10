package com.example.javabackend.Service;

import com.example.javabackend.Model.GeneralResponse;
import com.example.javabackend.Model.Users;
import com.example.javabackend.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // this function uses to create a new your in the system and save details in the database
    public Users createUser(Users users) {
        System.out.println("***** createUser function is starting *****");
        GeneralResponse generalResponse = new GeneralResponse();
        Users dbUser = new Users();

        try {
            dbUser = userRepository.save(users);

            if (dbUser != null) {
                System.out.println("User created successfully");
                generalResponse.setResponse(200);
                generalResponse.setMessage("User created successfully");
            }

        } catch (Exception e) {
            System.out.println("User creation failed");
            generalResponse.setResponse(400);
            generalResponse.setMessage("User creation failed");
            e.printStackTrace();
        }
        return users;
    }

    // this function uses to handle user login by validating user data and database data
    public GeneralResponse loginUser(Users user) {
        return null;
    }
}
