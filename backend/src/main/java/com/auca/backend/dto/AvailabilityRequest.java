package com.auca.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class AvailabilityRequest {
    private LocalDate date;
    private LocalTime start;
    private LocalTime end;
}
