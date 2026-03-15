package com.davnstech.datapulse.domain;

import java.time.Instant;

public record AlertEvent(
        String ruleId,
        String ruleName,
        String measurement,
        String field,
        double value,
        double threshold,
        String condition,
        Instant firedAt
) {
}
