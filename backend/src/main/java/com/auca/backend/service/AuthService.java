package com.auca.backend.service;

import com.auca.backend.config.JwtUtil;
import com.auca.backend.dto.AuthResponse;
import com.auca.backend.dto.DoctorRegistrationDto;
import com.auca.backend.dto.LoginRequest;
import com.auca.backend.dto.UserRegistrationDto;
import com.auca.backend.model.Doctor;
import com.auca.backend.model.Patient;
import com.auca.backend.model.Role;
import com.auca.backend.model.User;
import com.auca.backend.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse registerPatient(UserRegistrationDto dto) {
        Patient patient = new Patient();
        patient.setFullname(dto.getFullName());
        patient.setEmail(dto.getEmail());
        patient.setPassword(passwordEncoder.encode(dto.getPassword()));
        patient.setPhone(dto.getPhone());
        patient.setRole(Role.PATIENT);
        patient.setGender(dto.getGender());
        patient.setAddress(dto.getAddress());
        patient.setDateOfBirth(dto.getDateOfBirth() != null
                ? java.sql.Date.valueOf(dto.getDateOfBirth()) : null);
        userRepo.save(patient);
        return buildResponse(patient);
    }

    public AuthResponse registerDoctor(DoctorRegistrationDto dto) {
        Doctor doctor = new Doctor();
        doctor.setFullname(dto.getFullName());
        doctor.setEmail(dto.getEmail());
        doctor.setPassword(passwordEncoder.encode(dto.getPassword()));
        doctor.setPhone(dto.getPhone());
        doctor.setRole(Role.DOCTOR);
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        userRepo.save(doctor);
        return buildResponse(doctor);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        User user = userRepo.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(user.getId(), user.getFullname(), token, user.getRole().name(), user.getEmail());
    }

    private AuthResponse buildResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(user.getId(), user.getFullname(), token, user.getRole().name(), user.getEmail());
    }
}
