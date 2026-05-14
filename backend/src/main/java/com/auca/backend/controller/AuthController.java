package com.auca.backend.controller;

import com.auca.backend.dto.AuthResponse;
import com.auca.backend.dto.DoctorRegistrationDto;
import com.auca.backend.dto.LoginRequest;
import com.auca.backend.dto.UserRegistrationDto;
import com.auca.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(@RequestBody UserRegistrationDto dto) {
        return ResponseEntity.ok(authService.registerPatient(dto));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<AuthResponse> registerDoctor(@RequestBody DoctorRegistrationDto dto) {
        return ResponseEntity.ok(authService.registerDoctor(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
