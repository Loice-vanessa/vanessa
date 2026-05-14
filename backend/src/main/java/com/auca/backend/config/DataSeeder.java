package com.auca.backend.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.auca.backend.model.Appointment;
import com.auca.backend.model.AppointmentStatus;
import com.auca.backend.model.Admin;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.DoctorAvailability;
import com.auca.backend.model.MedicalRecord;
import com.auca.backend.model.Notification;
import com.auca.backend.model.Patient;
import com.auca.backend.model.Role;
import com.auca.backend.repository.AppointmentRepo;
import com.auca.backend.repository.AvailabilityRepo;
import com.auca.backend.repository.AdminRepo;
import com.auca.backend.repository.DoctorRepo;
import com.auca.backend.repository.MedicalRecordRepo;
import com.auca.backend.repository.NotificationRepo;
import com.auca.backend.repository.PatientRepo;
import com.auca.backend.repository.UserRepo;

@Component
@Profile("seed")
public class DataSeeder implements ApplicationRunner {
    private final NotificationRepo notificationRepo;
    private final MedicalRecordRepo medicalRecordRepo;
    private final AppointmentRepo appointmentRepo;
    private final AvailabilityRepo availabilityRepo;
    private final AdminRepo adminRepo;
    private final DoctorRepo doctorRepo;
    private final PatientRepo patientRepo;
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(NotificationRepo notificationRepo,
            MedicalRecordRepo medicalRecordRepo,
            AppointmentRepo appointmentRepo,
            AvailabilityRepo availabilityRepo,
            AdminRepo adminRepo,
            DoctorRepo doctorRepo,
            PatientRepo patientRepo,
            UserRepo userRepo,
            PasswordEncoder passwordEncoder) {
        this.notificationRepo = notificationRepo;
        this.medicalRecordRepo = medicalRecordRepo;
        this.appointmentRepo = appointmentRepo;
        this.availabilityRepo = availabilityRepo;
        this.adminRepo = adminRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedData();
    }

    private void seedData() {
        notificationRepo.deleteAllInBatch();
        medicalRecordRepo.deleteAllInBatch();
        appointmentRepo.deleteAllInBatch();
        availabilityRepo.deleteAllInBatch();
        adminRepo.deleteAllInBatch();
        doctorRepo.deleteAllInBatch();
        patientRepo.deleteAllInBatch();
        userRepo.deleteAllInBatch();

        Admin admin = new Admin();
        admin.setFullname("System Admin");
        admin.setEmail("admin@dhams.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setPhone("+250700000001");
        admin.setRole(Role.ADMIN);
        admin.setPermission("FULL_ACCESS");
        adminRepo.save(admin);

        Doctor doctor1 = new Doctor();
        doctor1.setFullname("Dr. Nadine Keza");
        doctor1.setEmail("nadine.keza@dhams.com");
        doctor1.setPassword(passwordEncoder.encode("Doctor@123"));
        doctor1.setPhone("+250700000002");
        doctor1.setRole(Role.DOCTOR);
        doctor1.setSpecialization("Internal Medicine");
        doctor1.setQualification("MD, Internal Medicine");

        Doctor doctor2 = new Doctor();
        doctor2.setFullname("Dr. Eric Ntwali");
        doctor2.setEmail("eric.ntwali@dhams.com");
        doctor2.setPassword(passwordEncoder.encode("Doctor@123"));
        doctor2.setPhone("+250700000003");
        doctor2.setRole(Role.DOCTOR);
        doctor2.setSpecialization("Cardiology");
        doctor2.setQualification("MD, Cardiology");

        Doctor doctor3 = new Doctor();
        doctor3.setFullname("Dr. Claire Uwase");
        doctor3.setEmail("claire.uwase@dhams.com");
        doctor3.setPassword(passwordEncoder.encode("Doctor@123"));
        doctor3.setPhone("+250700000004");
        doctor3.setRole(Role.DOCTOR);
        doctor3.setSpecialization("Pediatrics");
        doctor3.setQualification("MBChB, Pediatrics");

        Doctor doctor4 = new Doctor();
        doctor4.setFullname("Dr. Olivier Hakizimana");
        doctor4.setEmail("olivier.hakizimana@dhams.com");
        doctor4.setPassword(passwordEncoder.encode("Doctor@123"));
        doctor4.setPhone("+250700000005");
        doctor4.setRole(Role.DOCTOR);
        doctor4.setSpecialization("Dermatology");
        doctor4.setQualification("MD, Dermatology");

        Patient patient1 = new Patient();
        patient1.setFullname("Vanessa Ishimwe");
        patient1.setEmail("vanessa.ishimwe@dhams.com");
        patient1.setPassword(passwordEncoder.encode("Patient@123"));
        patient1.setPhone("+250788123456");
        patient1.setRole(Role.PATIENT);
        patient1.setGender("Female");
        patient1.setAddress("Kigali, Rwanda");
        patient1.setDateOfBirth(java.sql.Date.valueOf(LocalDate.of(1998, 4, 15)));
        patient1.setBloodGroup("O+");
        patient1.setInsuranceProvider("RSSB Mutuelle de Sante");
        patient1.setInsuranceMemberNumber("MUT-2026-000184");
        patient1.setInsuranceCoverageType("Community Based Health Insurance");
        patient1.setInsuranceExpiryDate(java.sql.Date.valueOf(LocalDate.now().plusMonths(9)));

        Patient patient2 = new Patient();
        patient2.setFullname("Jean Bosco Nkurunziza");
        patient2.setEmail("jean.nkurunziza@dhams.com");
        patient2.setPassword(passwordEncoder.encode("Patient@123"));
        patient2.setPhone("+250788654321");
        patient2.setRole(Role.PATIENT);
        patient2.setGender("Male");
        patient2.setAddress("Kigali, Rwanda");
        patient2.setDateOfBirth(java.sql.Date.valueOf(LocalDate.of(2000, 1, 15)));
        patient2.setBloodGroup("A+");
        patient2.setInsuranceProvider("MMI");
        patient2.setInsuranceMemberNumber("MMI-250-48291");
        patient2.setInsuranceCoverageType("Public Service Medical Insurance");
        patient2.setInsuranceExpiryDate(java.sql.Date.valueOf(LocalDate.now().plusMonths(7)));

        Patient patient3 = new Patient();
        patient3.setFullname("Aimee Mukamana");
        patient3.setEmail("aimee.mukamana@dhams.com");
        patient3.setPassword(passwordEncoder.encode("Patient@123"));
        patient3.setPhone("+250788111222");
        patient3.setRole(Role.PATIENT);
        patient3.setGender("Female");
        patient3.setAddress("Gasabo, Kigali");
        patient3.setDateOfBirth(java.sql.Date.valueOf(LocalDate.of(2003, 8, 22)));
        patient3.setBloodGroup("B+");
        patient3.setInsuranceProvider("Radiant Insurance");
        patient3.setInsuranceMemberNumber("RAD-MED-80422");
        patient3.setInsuranceCoverageType("Private Medical Cover");
        patient3.setInsuranceExpiryDate(java.sql.Date.valueOf(LocalDate.now().plusMonths(5)));

        Patient patient4 = new Patient();
        patient4.setFullname("Diane Akimana");
        patient4.setEmail("diane.akimana@dhams.com");
        patient4.setPassword(passwordEncoder.encode("Patient@123"));
        patient4.setPhone("+250788333444");
        patient4.setRole(Role.PATIENT);
        patient4.setGender("Female");
        patient4.setAddress("Nyarugenge, Kigali");
        patient4.setDateOfBirth(java.sql.Date.valueOf(LocalDate.of(1996, 11, 3)));
        patient4.setBloodGroup("O-");
        patient4.setInsuranceProvider("Sanlam Rwanda");
        patient4.setInsuranceMemberNumber("SAN-HLT-66210");
        patient4.setInsuranceCoverageType("Employer Medical Cover");
        patient4.setInsuranceExpiryDate(java.sql.Date.valueOf(LocalDate.now().plusMonths(11)));

        List<Doctor> doctors = doctorRepo.saveAll(List.of(doctor1, doctor2, doctor3, doctor4));
        List<Patient> patients = patientRepo.saveAll(List.of(patient1, patient2, patient3, patient4));

        DoctorAvailability ss1 = slot(doctors.get(0), LocalDate.now().minusDays(60), 9, 0, 10, 0, false);
        DoctorAvailability ss2 = slot(doctors.get(0), LocalDate.now().minusDays(45), 10, 0, 11, 0, false);
        DoctorAvailability ss3 = slot(doctors.get(0), LocalDate.now().minusDays(30), 9, 0, 10, 0, false);
        DoctorAvailability ss4 = slot(doctors.get(0), LocalDate.now().minusDays(14), 14, 0, 15, 0, false);
        DoctorAvailability ss5 = slot(doctors.get(0), LocalDate.now().minusDays(7), 9, 0, 10, 0, false);
        DoctorAvailability ss6 = slot(doctors.get(0), LocalDate.now().minusDays(3), 10, 0, 11, 0, false);
        DoctorAvailability ss7 = slot(doctors.get(0), LocalDate.now().plusDays(1), 9, 0, 10, 0, true);
        DoctorAvailability ss8 = slot(doctors.get(0), LocalDate.now().plusDays(1), 10, 0, 11, 0, true);
        DoctorAvailability ss9 = slot(doctors.get(0), LocalDate.now().plusDays(2), 9, 0, 10, 0, false);
        DoctorAvailability ss10 = slot(doctors.get(0), LocalDate.now().plusDays(3), 14, 0, 15, 0, true);
        DoctorAvailability ss11 = slot(doctors.get(0), LocalDate.now().plusDays(5), 9, 0, 10, 0, true);
        DoctorAvailability d2s1 = slot(doctors.get(1), LocalDate.now().minusDays(20), 10, 0, 11, 0, false);
        DoctorAvailability d2s2 = slot(doctors.get(1), LocalDate.now().plusDays(2), 10, 0, 11, 0, true);
        DoctorAvailability d3s1 = slot(doctors.get(2), LocalDate.now().minusDays(10), 14, 0, 15, 0, false);
        DoctorAvailability d3s2 = slot(doctors.get(2), LocalDate.now().plusDays(1), 14, 0, 15, 0, false);
        DoctorAvailability d4s1 = slot(doctors.get(3), LocalDate.now().minusDays(5), 8, 30, 9, 30, false);
        DoctorAvailability d4s2 = slot(doctors.get(3), LocalDate.now().plusDays(3), 8, 30, 9, 30, true);

        List<DoctorAvailability> slots = availabilityRepo.saveAll(List.of(
                ss1, ss2, ss3, ss4, ss5, ss6, ss7, ss8, ss9, ss10, ss11,
                d2s1, d2s2, d3s1, d3s2, d4s1, d4s2));

        Appointment a1 = appt(patients.get(0), doctors.get(0), slots.get(0), "Persistent headaches and dizziness", AppointmentStatus.COMPLETED);
        Appointment a2 = appt(patients.get(0), doctors.get(0), slots.get(1), "Follow-up after blood pressure review", AppointmentStatus.COMPLETED);
        Appointment a3 = appt(patients.get(0), doctors.get(0), slots.get(2), "Fatigue and low appetite", AppointmentStatus.COMPLETED);
        Appointment a4 = appt(patients.get(0), doctors.get(1), slots.get(11), "Chest discomfort during exercise", AppointmentStatus.COMPLETED);
        Appointment a5 = appt(patients.get(0), doctors.get(0), slots.get(4), "Routine check-up request", AppointmentStatus.CANCELLED);
        Appointment a6 = appt(patients.get(0), doctors.get(2), slots.get(13), "Vaccination counseling for younger sibling", AppointmentStatus.COMPLETED);
        Appointment a7 = appt(patients.get(0), doctors.get(0), slots.get(8), "Monthly hypertension review", AppointmentStatus.CONFIRMED);
        Appointment a8 = appt(patients.get(0), doctors.get(3), slots.get(15), "Recurring skin irritation", AppointmentStatus.PENDING);
        Appointment a9 = appt(patients.get(1), doctors.get(1), slots.get(5), "Palpitations and shortness of breath", AppointmentStatus.COMPLETED);
        Appointment a10 = appt(patients.get(2), doctors.get(2), slots.get(6), "Persistent cough and fever", AppointmentStatus.CONFIRMED);
        Appointment a11 = appt(patients.get(3), doctors.get(3), slots.get(9), "Follow-up for eczema treatment", AppointmentStatus.PENDING);
        Appointment a12 = appt(patients.get(1), doctors.get(0), slots.get(12), "General wellness and lab review", AppointmentStatus.COMPLETED);
        Appointment a13 = appt(patients.get(2), doctors.get(2), slots.get(14), "Asthma action plan review", AppointmentStatus.COMPLETED);
        Appointment a14 = appt(patients.get(3), doctors.get(3), slots.get(16), "Acne treatment consultation", AppointmentStatus.CANCELLED);

        List<Appointment> appointments = appointmentRepo.saveAll(List.of(
                a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14));

        MedicalRecord r1 = record(patients.get(0), appointments.get(0),
                "Migraine with elevated blood pressure",
                "Ibuprofen 400mg when needed. Start Amlodipine 5mg once daily.",
                "Advised hydration, sleep tracking, weekly BP checks, and reduced salt intake.",
                LocalDate.now().minusDays(60));

        MedicalRecord r2 = record(patients.get(0), appointments.get(1),
                "Hypertension improving",
                "Continue Amlodipine 5mg once daily.",
                "BP improved to 132/84. Continue lifestyle changes and return in one month.",
                LocalDate.now().minusDays(45));

        MedicalRecord r3 = record(patients.get(0), appointments.get(2),
                "Iron deficiency anaemia",
                "Ferrous sulphate 200mg twice daily for 8 weeks.",
                "Haemoglobin low on screening. Recommended iron-rich foods and repeat CBC.",
                LocalDate.now().minusDays(30));

        MedicalRecord r4 = record(patients.get(0), appointments.get(3),
                "Exercise-induced chest discomfort, ECG normal",
                "No cardiac medication started. Continue BP medication.",
                "ECG normal. Recommended gradual exercise plan and follow-up if pain returns.",
                LocalDate.now().minusDays(14));

        MedicalRecord r5 = record(patients.get(0), appointments.get(5),
                "Preventive counseling completed",
                "No prescription required.",
                "Reviewed immunisation schedule and household infection prevention guidance.",
                LocalDate.now().minusDays(20));

        MedicalRecord r6 = record(patients.get(1), appointments.get(8),
                "Sinus tachycardia linked to caffeine use",
                "Oral rehydration and magnesium supplement for 7 days.",
                "Reduced caffeine advised. Repeat pulse review scheduled if symptoms persist.",
                LocalDate.now().minusDays(3));

        MedicalRecord r7 = record(patients.get(1), appointments.get(11),
                "Mild dehydration and vitamin D deficiency",
                "Vitamin D 1000 IU daily for 30 days. Oral rehydration as needed.",
                "Kidney function normal. Encouraged regular meals and fluids.",
                LocalDate.now().minusDays(20));

        MedicalRecord r8 = record(patients.get(2), appointments.get(12),
                "Mild persistent asthma",
                "Salbutamol inhaler as needed. Budesonide inhaler twice daily.",
                "Asthma action plan reviewed. Avoid smoke exposure and return after 4 weeks.",
                LocalDate.now().minusDays(10));

        medicalRecordRepo.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8));

        Notification n1 = notif(appointments.get(6),
                "Your hypertension review with Dr. Nadine Keza has been confirmed.",
                "APPOINTMENT_CONFIRMATION", LocalDateTime.now().minusHours(2), false);
        Notification n2 = notif(appointments.get(0),
                "Your migraine and blood pressure visit record is now available.",
                "MEDICAL_RECORD_UPDATE", LocalDateTime.now().minusDays(60), true);
        Notification n3 = notif(appointments.get(3),
                "A cardiology visit record has been added by Dr. Eric Ntwali.",
                "MEDICAL_RECORD_UPDATE", LocalDateTime.now().minusDays(14), false);
        Notification n4 = notif(appointments.get(4),
                "Your appointment has been cancelled. Please reschedule.",
                "APPOINTMENT_CANCELLED", LocalDateTime.now().minusDays(7), true);
        Notification n5 = notif(appointments.get(7),
                "Your dermatology appointment request is pending confirmation.",
                "APPOINTMENT_PENDING", LocalDateTime.now().minusHours(5), false);

        notificationRepo.saveAll(List.of(n1, n2, n3, n4, n5));
    }

    private DoctorAvailability slot(Doctor doctor, LocalDate date, int sh, int sm, int eh, int em, boolean available) {
        DoctorAvailability s = new DoctorAvailability();
        s.setDoctor(doctor);
        s.setDate(date);
        s.setStartTime(LocalTime.of(sh, sm));
        s.setEndTime(LocalTime.of(eh, em));
        s.setAvailable(available);
        return s;
    }

    private Appointment appt(Patient patient, Doctor doctor, DoctorAvailability slot, String note, AppointmentStatus status) {
        Appointment a = new Appointment();
        a.setPatient(patient);
        a.setDoctor(doctor);
        a.setAvailabilitySlot(slot);
        a.setDate(slot.getDate());
        a.setTime(slot.getStartTime());
        a.setNote(note);
        a.setStatus(status);
        return a;
    }

    private MedicalRecord record(Patient patient, Appointment appointment, String diagnosis, String prescription, String note, LocalDate visitDate) {
        MedicalRecord r = new MedicalRecord();
        r.setPatient(patient);
        r.setAppointment(appointment);
        r.setDiagnosis(diagnosis);
        r.setPrescription(prescription);
        r.setNote(note);
        r.setVisitDate(visitDate);
        return r;
    }

    private Notification notif(Appointment appointment, String message, String type, LocalDateTime sentAt, boolean read) {
        Notification n = new Notification();
        n.setAppointment(appointment);
        n.setMessage(message);
        n.setType(type);
        n.setSentAt(sentAt);
        n.setRead(read);
        return n;
    }
}
