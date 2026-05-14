package com.auca.backend.dto;

import lombok.Data;

@Data
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Long availabilityId;
    private String note;
}
