package com.auca.backend.repository;

import com.auca.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByAppointment_AppointmentId(Long appointmentId);
    List<Notification> findByIsReadFalse();
}
