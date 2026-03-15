package com.davnstech.datapulse.dto;

public record AuthResponse(String accessToken, String refreshToken, long expiresIn) {
}
