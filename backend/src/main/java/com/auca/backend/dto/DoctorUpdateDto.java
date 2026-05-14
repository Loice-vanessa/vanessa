package com.auca.backend.dto;

import lombok.Data;

@Data
public class DoctorUpdateDto {
    private String fullName;
    private String phone;
    private String specialization;
    private String qualification;
}
