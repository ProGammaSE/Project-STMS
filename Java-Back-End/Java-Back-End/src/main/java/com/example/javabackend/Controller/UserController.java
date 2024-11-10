package com.example.javabackend.Controller;

import com.example.javabackend.Model.GeneralResponse;
import com.example.javabackend.Model.Users;
import com.example.javabackend.Service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // controller function to create a new user
    @PostMapping(value = "/user/register")
    public Users createUser(@RequestBody Users user) {
        return userService.createUser(user);
    }

    // controller function to handle login
    @PostMapping(value = "/user/login")
    public GeneralResponse loginUser(@RequestBody Users user) {
        return userService.loginUser(user);
    }
}
