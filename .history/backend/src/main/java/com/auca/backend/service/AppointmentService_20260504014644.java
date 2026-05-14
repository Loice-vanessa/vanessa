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

    public AppointmentService(AppointmentRepo appointmentRepository, AvailabilityRepo availabilityRepository,
            PatientRepo patientRepository, DoctorRepo doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

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

        // 3. Build and save the appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAvailabilitySlot(slot);
        appointment.setDate(slot.getDate());
        appointment.setTime(slot.getStartTime());
        appointment.setNote(note);

        // 4. Mark slot as unavailable
        slot.setAvailable(false);
        availabilityRepository.save(slot);

        return appointmentRepository.save(appointment);
    }
}
