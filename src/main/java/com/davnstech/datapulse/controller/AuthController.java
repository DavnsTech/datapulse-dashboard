package com.davnstech.datapulse.controller;

import com.davnstech.datapulse.dto.AuthResponse;
import com.davnstech.datapulse.dto.LoginRequest;
import com.davnstech.datapulse.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtTokenProvider jwtTokenProvider;
    private final String validUsername;
    private final String validPassword;

    public AuthController(
            JwtTokenProvider jwtTokenProvider,
            @Value("${auth.username}") String validUsername,
            @Value("${auth.password}") String validPassword) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.validUsername = validUsername;
        this.validPassword = validPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        boolean usernameMatch = java.security.MessageDigest.isEqual(
                validUsername.getBytes(), request.username().getBytes());
        boolean passwordMatch = java.security.MessageDigest.isEqual(
                validPassword.getBytes(), request.password().getBytes());
        if (!usernameMatch || !passwordMatch) {
            return ResponseEntity.status(401).build();
        }

        String accessToken = jwtTokenProvider.generateAccessToken(request.username());
        String refreshToken = jwtTokenProvider.generateRefreshToken(request.username());

        return ResponseEntity.ok(new AuthResponse(
                accessToken, refreshToken, jwtTokenProvider.getExpirationMs()));
    }
}
