package com.auca.backend.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PatientProfileUpdateDto {
    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String bloodGroup;
    private String insuranceProvider;
    private String insuranceMemberNumber;
    private String insuranceCoverageType;
    private LocalDate insuranceExpiryDate;
}
