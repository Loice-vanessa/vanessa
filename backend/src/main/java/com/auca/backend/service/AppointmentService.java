package com.auca.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auca.backend.model.Appointment;
import com.auca.backend.model.AppointmentStatus;
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

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    public Appointment getById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
    }

    public List<Appointment> getByPatient(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    @Transactional
    public Appointment bookAppointment(Long patientId, Long doctorId, Long availabilityId, String note) {
        DoctorAvailability slot = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Availability slot not found"));

        if (slot.getDoctor() == null || !slot.getDoctor().getId().equals(doctorId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Selected availability does not belong to the specified doctor");
        }
        if (!slot.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Doctor is already booked for this time");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAvailabilitySlot(slot);
        appointment.setDate(slot.getDate());
        appointment.setTime(slot.getStartTime());
        appointment.setNote(note);

        slot.setAvailable(false);
        availabilityRepository.save(slot);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public void confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only pending appointments can be confirmed");
        }
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        // free the slot back
        if (appointment.getAvailabilitySlot() != null) {
            appointment.getAvailabilitySlot().setAvailable(true);
            availabilityRepository.save(appointment.getAvailabilitySlot());
        }
        appointmentRepository.save(appointment);
    }
}
