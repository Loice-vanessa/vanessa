package com.auca.backend.repository;

import com.auca.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Find all appointments for a specific patient
    List<Appointment> findByPatientUserId(Long patientId);
    
    // Find all appointments for a specific doctor
    List<Appointment> findByDoctorUserId(Long doctorId);
}

public interface AvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    // Get available slots for a specific doctor on a specific date
    List<DoctorAvailability> findByDoctorUserIdAndDateAndAvailableTrue(Long doctorId, LocalDate date);
}