package com.auca.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "patients")
@Data
public class Patient extends User {
    private String gender;
    private String address;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    private String bloodGroup;

    private String insuranceProvider;
    private String insuranceMemberNumber;
    private String insuranceCoverageType;
    private Date insuranceExpiryDate;
}
