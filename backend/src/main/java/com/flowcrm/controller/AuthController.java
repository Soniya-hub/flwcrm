package com.flowcrm.controller;

import com.flowcrm.dto.AuthDto;
import com.flowcrm.service.AuthService;
import com.flowcrm.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(
            @Valid @RequestBody AuthDto.LoginRequest req,
            HttpServletRequest request) {
        String ip = getClientIp(request);
        rateLimitService.checkLimit(ip);
        try {
            AuthDto.AuthResponse response = authService.login(req);
            rateLimitService.clearAttempts(ip);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            rateLimitService.recordFailure(ip);
            throw e;
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthDto.AuthResponse> signup(@Valid @RequestBody AuthDto.SignupRequest req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
