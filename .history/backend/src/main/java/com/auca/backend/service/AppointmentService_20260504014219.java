package com.auca.backend.service;

import org.springframework.stereotype.Service;

import com.auca.backend.repository.AppointmentRepo;

@Service
public class AppointmentService {
    private final AppointmentRepo appointmentRepository;
    private final AvailabilityRepo availabilityRepository;
    private final PatientRepo patientRepository;
    private final DoctorRepoy doctorRepository;

}
