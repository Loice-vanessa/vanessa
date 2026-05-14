package main.java.com.auca.backend.model;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // e.g., "EMAIL", "SMS", "IN_APP"

    private LocalDateTime sentAt;

    private boolean isRead = false;
}
