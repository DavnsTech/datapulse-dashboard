package com.davnstech.datapulse.domain;

public record AlertRule(
        String id,
        String name,
        String measurement,
        String field,
        String condition,
        double threshold,
        boolean enabled
) {

    public boolean evaluate(double value) {
        return switch (condition) {
            case ">" -> value > threshold;
            case "<" -> value < threshold;
            case ">=" -> value >= threshold;
            case "<=" -> value <= threshold;
            case "=" -> Math.abs(value - threshold) < 0.0001;
            default -> false;
        };
    }
}
