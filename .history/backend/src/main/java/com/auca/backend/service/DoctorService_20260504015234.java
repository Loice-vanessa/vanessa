package com.auca.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.auca.backend.model.Appointment;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;
import com.auca.backend.repository.DoctorRepo;

@Service
public class DoctorService {
    private final AvailabilityRepo availabilityRepository;
    private final AppointmentRepo appointmentRepository;
    private final DoctorRepo doctorRepository;

    public DoctorService(AvailabilityRepo availabilityRepository, AppointmentRepo appointmentRepository,
            DoctorRepo doctorRepository) {
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
    }

    public void addAvailability(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setDate(date);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        availability.setAvailable(true);
        availabilityRepository.save(availability);
    }

    public List<Appointment> getDoctorSchedule(Long doctorId) {
        return appointmentRepository.findByDoctorUserId(doctorId);
    }
}
