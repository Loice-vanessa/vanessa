package com.auca.backend.service;

import org.springframework.stereotype.Service;

import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;

@Service
public class DoctorService {
    private final AvailabilityRepo availabilityRepository;
    private final AppointmentRepo appointmentRepository;

    public void addAvailability(Long doctorId, String date, String startTime, String endTime) {
        Doct
    }
}
