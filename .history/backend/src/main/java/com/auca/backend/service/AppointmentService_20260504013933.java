package com.auca.backend.service;

import org.springframework.stereotype.Service;

import com.auca.backend.repository.AppointmentRepo;

@Service
public class AppointmentService {
    private final AppointmentRepo appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

}
