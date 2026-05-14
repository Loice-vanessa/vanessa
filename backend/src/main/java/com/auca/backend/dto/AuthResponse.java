package com.auca.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String fullName;
    private String token;
    private String role;
    private String email;
}
