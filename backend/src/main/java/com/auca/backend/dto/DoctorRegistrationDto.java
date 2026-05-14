package com.auca.backend.dto;

import lombok.Data;

@Data
public class DoctorRegistrationDto {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String specialization;
    private String qualification;
}
