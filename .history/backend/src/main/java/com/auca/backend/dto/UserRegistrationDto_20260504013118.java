package com.auca.backend.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserRegistrationDto {
    private String fullName;
    private String email;
    private String password;
    private String role; 
    private String phone;

    // patient specific fields
    private String gender;
    private String address;
    private LocalDate dateOfBirth;
}
