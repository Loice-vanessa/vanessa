package com.auca.backend.service;

import org.springframework.stereotype.Service;

import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;
import com.auca.backend.repository.DoctorRepo;
import com.auca.backend.repository.PatientRepo;

@Service
public class AppointmentService {
    private final AppointmentRepo appointmentRepository;
    private final AvailabilityRepo availabilityRepository;
    private final PatientRepo patientRepository;
    private final DoctorRepo doctorRepository;

    @Tr
}
