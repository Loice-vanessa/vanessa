package com.auca.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auca.backend.dto.PatientUpdateDto;
import com.auca.backend.model.Appointment;
import com.auca.backend.model.MedicalRecord;
import com.auca.backend.model.Patient;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.MedicalRecordRepo;
import com.auca.backend.repository.PatientRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final MedicalRecordRepo medicalRecordRepository;
    private final PatientRepo patientRepository;
    private final AppointmentRepo appointmentRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getById(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    public Patient updateProfile(Long patientId, PatientUpdateDto dto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        if (dto.getFullName()   != null) patient.setFullname(dto.getFullName());
        if (dto.getPhone()      != null) patient.setPhone(dto.getPhone());
        if (dto.getGender()     != null) patient.setGender(dto.getGender());
        if (dto.getAddress()    != null) patient.setAddress(dto.getAddress());
        if (dto.getBloodGroup() != null) patient.setBloodGroup(dto.getBloodGroup());
        if (dto.getInsuranceProvider() != null) patient.setInsuranceProvider(dto.getInsuranceProvider());
        if (dto.getInsuranceMemberNumber() != null) patient.setInsuranceMemberNumber(dto.getInsuranceMemberNumber());
        if (dto.getInsuranceCoverageType() != null) patient.setInsuranceCoverageType(dto.getInsuranceCoverageType());
        if (dto.getDateOfBirth() != null && !dto.getDateOfBirth().isBlank()) {
            try {
                patient.setDateOfBirth(java.sql.Date.valueOf(dto.getDateOfBirth()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (dto.getInsuranceExpiryDate() != null && !dto.getInsuranceExpiryDate().isBlank()) {
            try {
                patient.setInsuranceExpiryDate(java.sql.Date.valueOf(dto.getInsuranceExpiryDate()));
            } catch (IllegalArgumentException ignored) {}
        }

        return patientRepository.save(patient);
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatient_Id(patientId);
    }

    public List<MedicalRecord> getPatientRecords(Long patientId) {
        return medicalRecordRepository.findByPatient_Id(patientId);
    }
}
