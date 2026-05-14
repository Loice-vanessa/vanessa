package com.auca.backend.dto;

import lombok.Data;

@Data
public class PatientUpdateDto {
    private String fullName;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String bloodGroup;
    private String insuranceProvider;
    private String insuranceMemberNumber;
    private String insuranceCoverageType;
    private String insuranceExpiryDate;
}
