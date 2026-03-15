package com.davnstech.datapulse.dto;

import java.util.List;

public record MetricsResponse(
        String measurement,
        String field,
        String range,
        List<TimeSeriesPoint> points
) {
}
