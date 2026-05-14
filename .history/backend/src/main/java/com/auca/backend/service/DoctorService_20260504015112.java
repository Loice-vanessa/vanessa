package com.auca.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;

@Service
public class DoctorService {
    private final AvailabilityRepo availabilityRepository;
    private final AppointmentRepo appointmentRepository;

    public void addAvailability(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctorId(doctorId);
        availability.setDate(date);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        availability.setAvailable(true);
        availabilityRepository.save(availability);
    }
}
