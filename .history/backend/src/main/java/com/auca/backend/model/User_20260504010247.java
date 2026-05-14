package com.auca.backend.model;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(nullable = false)
    private Role role;
}


@Entity
@Table(name = "patients")
@Data
public class Patient extends User {
    private String gender;
    private String address;
    private java.time.LocalDate dateOfBirth;
    private String bloodGroup;
}