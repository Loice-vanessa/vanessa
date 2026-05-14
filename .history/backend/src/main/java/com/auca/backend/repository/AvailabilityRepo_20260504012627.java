package com.auca.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auca.backend.model.DoctorAvailability;

@Repository
public interface AvailabilityRepo extends JpaRepository<DoctorAvailability, Long> {
    List
}
