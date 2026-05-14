package com.auca.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.auca.backend.model.Appointment;
import com.auca.backend.model.AppointmentStatus;
import com.auca.backend.model.MedicalRecord;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.MedicalRecordRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepo recordRepository;
    private final AppointmentRepo appointmentRepository;

    public MedicalRecord createRecord(Long appointmentId, String diagnosis, String prescription, String note) {
        Appointment appt = appointmentRepository.findById(appointmentId).orElseThrow();

        MedicalRecord record = new MedicalRecord();
        record.setAppointment(appt);
        record.setPatient(appt.getPatient());
        record.setDiagnosis(diagnosis);
        record.setPrescription(prescription);
        record.setNote(note);
        record.setVisitDate(LocalDate.now());

        appt.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appt);

        return recordRepository.save(record);
    }

    public List<MedicalRecord> getByPatient(Long patientId) {
        return recordRepository.findByPatient_Id(patientId);
    }
}
