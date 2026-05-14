package main.java.com.auca.backend.model;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability")
@Data
@noArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availabilityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    @Column(name = "is_available")
    private boolean available = true;
}
