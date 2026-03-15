package com.davnstech.datapulse.domain;

import java.time.Instant;
import java.util.List;

public record DashboardConfig(
        String id,
        String name,
        List<Panel> panels,
        Instant createdAt,
        Instant updatedAt
) {

    public record GridPosition(int x, int y, int width, int height) {
    }

    public record Panel(
            String id,
            String title,
            String chartType,
            String measurement,
            String field,
            String aggregation,
            GridPosition grid
    ) {
    }
}
