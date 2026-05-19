package com.flowcrm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6)
        private String password;
    }

    @Data
    public static class SignupRequest {
        @NotBlank @Size(min = 2, max = 100)
        private String name;

        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6, max = 100)
        private String password;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}
