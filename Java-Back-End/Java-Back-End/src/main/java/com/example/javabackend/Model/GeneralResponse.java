package com.example.javabackend.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeneralResponse {

    private int response;
    private String message;
    private Users user;
}
