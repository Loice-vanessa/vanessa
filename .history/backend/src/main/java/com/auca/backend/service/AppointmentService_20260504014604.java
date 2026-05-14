package com.auca.backend.service;

import org.springframework.stereotype.Service;

import com.auca.backend.model.Appointment;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.model.Patient;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;
import com.auca.backend.repository.DoctorRepo;
import com.auca.backend.repository.PatientRepo;

import jakarta.transaction.Transactional;

@Service
public class AppointmentService {
    private final AppointmentRepo appointmentRepository;
    private final AvailabilityRepo availabilityRepository;
    private final PatientRepo patientRepository;
    private final DoctorRepo doctorRepository;

    @Transactional
    public Appointment bookAppointment(Long patientId, Long doctorId, Long availabilityId, String note) {
        // 1. Verify availability slot exists and is free
        DoctorAvailability slot = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));
        
        if (!slot.isAvailable()) {
            throw new RuntimeException("Doctor is already booked for this time.");
        }

        // 2. Fetch Patient and Doctor
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();

    }
}
