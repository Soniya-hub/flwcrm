package com.flowcrm.service;

import com.flowcrm.dto.AuthDto;
import com.flowcrm.entity.User;
import com.flowcrm.exception.BadRequestException;
import com.flowcrm.repository.UserRepository;
import com.flowcrm.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthDto.AuthResponse login(AuthDto.LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthDto.AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public AuthDto.AuthResponse signup(AuthDto.SignupRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(User.Role.USER)
                .status(User.Status.ACTIVE)
                .build();
        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthDto.AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
