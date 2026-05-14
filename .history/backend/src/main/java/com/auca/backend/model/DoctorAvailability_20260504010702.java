package main.java.com.auca.backend.model;

@Entity
@Table(name = "doctor_availability")
@Data
@noArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
}
