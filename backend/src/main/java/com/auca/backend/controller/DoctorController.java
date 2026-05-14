package com.auca.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auca.backend.dto.AvailabilityRequest;
import com.auca.backend.dto.DoctorUpdateDto;
import com.auca.backend.dto.DoctorRegistrationDto;
import com.auca.backend.model.Appointment;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.model.Patient;
import com.auca.backend.service.DoctorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody DoctorRegistrationDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.createDoctor(request));
    }

    @PostMapping("/{doctorId}/availability")
    public ResponseEntity<Void> addAvailability(@PathVariable Long doctorId,
            @RequestBody AvailabilityRequest request) {
        doctorService.addAvailability(doctorId, request.getDate(), request.getStart(), request.getEnd());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/availability/{slotId}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long slotId) {
        doctorService.deleteAvailability(slotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<List<DoctorAvailability>> getAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getAllDoctorSlots(doctorId));
    }

    @GetMapping("/{doctorId}/schedule")
    public ResponseEntity<List<Appointment>> getSchedule(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorSchedule(doctorId));
    }

    @GetMapping("/{doctorId}/patients")
    public ResponseEntity<List<Patient>> getPatients(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorPatients(doctorId));
    }

    @PutMapping("/{doctorId}")
    public ResponseEntity<Doctor> updateProfile(@PathVariable Long doctorId,
            @RequestBody DoctorUpdateDto dto) {
        return ResponseEntity.ok(doctorService.updateProfile(doctorId, dto));
    }
}
