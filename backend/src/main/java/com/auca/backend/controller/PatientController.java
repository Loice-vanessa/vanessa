package com.auca.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auca.backend.dto.PatientUpdateDto;
import com.auca.backend.model.Appointment;
import com.auca.backend.model.MedicalRecord;
import com.auca.backend.model.Patient;
import com.auca.backend.service.PatientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Patient> getProfile(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getById(patientId));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<Patient> updateProfile(@PathVariable Long patientId,
            @RequestBody PatientUpdateDto dto) {
        return ResponseEntity.ok(patientService.updateProfile(patientId, dto));
    }

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientAppointments(patientId));
    }

    @GetMapping("/{patientId}/records")
    public ResponseEntity<List<MedicalRecord>> getMedicalHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientService.getPatientRecords(patientId));
    }
}
