package main.java.com.auca.backend.model;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Optional: Link to the specific slot if you want to lock it
    @OneToOne
    @JoinColumn(name = "availability_id")
    private DoctorAvailability availabilitySlot;

    private LocalDate date;
    private LocalTime time;
    private String note;
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;
}


enum AppointmentStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}
