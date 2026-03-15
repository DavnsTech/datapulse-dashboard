package com.davnstech.datapulse.dto;

import java.time.Instant;

public record TimeSeriesPoint(Instant timestamp, double value) {
}
