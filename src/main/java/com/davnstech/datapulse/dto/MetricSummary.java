package com.davnstech.datapulse.dto;

public record MetricSummary(
        String measurement,
        String field,
        double lastValue,
        double meanValue,
        double maxValue,
        double minValue
) {
}
