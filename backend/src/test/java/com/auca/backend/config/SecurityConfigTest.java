package com.auca.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

class SecurityConfigTest {

    @Test
    void corsConfigurationAllowsConfiguredOriginPatternsAndMethods() throws Exception {
        SecurityConfig securityConfig = new SecurityConfig(null, null);
        setAllowedOriginPatterns(securityConfig, List.of("http://localhost:*", "https://app.example.com"));

        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/auth/login");
        request.addHeader("Origin", "http://localhost:5174");
        request.addHeader("Access-Control-Request-Method", "POST");

        CorsConfiguration configuration = source.getCorsConfiguration(request);

        assertNotNull(configuration);
        assertEquals("http://localhost:5174", configuration.checkOrigin("http://localhost:5174"));
        assertTrue(configuration.checkHttpMethod(org.springframework.http.HttpMethod.POST)
                .contains(org.springframework.http.HttpMethod.POST));
        assertEquals(true, configuration.getAllowCredentials());
    }

    private void setAllowedOriginPatterns(SecurityConfig securityConfig, List<String> originPatterns)
            throws NoSuchFieldException, IllegalAccessException {
        Field field = SecurityConfig.class.getDeclaredField("allowedOriginPatterns");
        field.setAccessible(true);
        field.set(securityConfig, originPatterns);
    }
}
