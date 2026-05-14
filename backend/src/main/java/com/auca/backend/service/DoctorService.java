package com.auca.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auca.backend.dto.DoctorRegistrationDto;
import com.auca.backend.model.Appointment;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.model.Patient;
import com.auca.backend.model.Role;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;
import com.auca.backend.repository.DoctorRepo;
import com.auca.backend.repository.UserRepo;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class DoctorService {
    private final AvailabilityRepo availabilityRepository;
    private final AppointmentRepo appointmentRepository;
    private final DoctorRepo doctorRepository;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(AvailabilityRepo availabilityRepository, AppointmentRepo appointmentRepository,
            DoctorRepo doctorRepository, UserRepo userRepository, PasswordEncoder passwordEncoder) {
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
    }

    public Doctor createDoctor(DoctorRegistrationDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        Doctor doctor = new Doctor();
        doctor.setFullname(request.getFullName());
        doctor.setEmail(request.getEmail());
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));
        doctor.setPhone(request.getPhone());
        doctor.setRole(Role.DOCTOR);
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        return doctorRepository.save(doctor);
    }

    public void addAvailability(Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setDate(date);
        availability.setStartTime(startTime);
        availability.setEndTime(endTime);
        availability.setAvailable(true);
        availabilityRepository.save(availability);
    }

    public void deleteAvailability(Long availabilityId) {
        DoctorAvailability slot = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));
        if (!slot.isAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cannot delete a booked slot");
        }
        availabilityRepository.delete(slot);
    }

    public List<DoctorAvailability> getDoctorAvailability(Long doctorId) {
        return availabilityRepository.findByDoctor_IdAndAvailableTrue(doctorId);
    }

    public List<DoctorAvailability> getAllDoctorSlots(Long doctorId) {
        return availabilityRepository.findByDoctor_Id(doctorId);
    }

    public List<Appointment> getDoctorSchedule(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId);
    }

    public List<Patient> getDoctorPatients(Long doctorId) {
        return appointmentRepository.findByDoctor_Id(doctorId).stream()
                .map(Appointment::getPatient)
                .distinct()
                .collect(Collectors.toList());
    }

    public Doctor updateProfile(Long doctorId, com.auca.backend.dto.DoctorUpdateDto dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
        if (dto.getFullName()       != null) doctor.setFullname(dto.getFullName());
        if (dto.getPhone()          != null) doctor.setPhone(dto.getPhone());
        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getQualification()  != null) doctor.setQualification(dto.getQualification());
        return doctorRepository.save(doctor);
    }
}
