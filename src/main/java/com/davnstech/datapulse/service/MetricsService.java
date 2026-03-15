package com.davnstech.datapulse.service;

import com.davnstech.datapulse.dto.MetricSummary;
import com.davnstech.datapulse.dto.MetricsResponse;
import com.davnstech.datapulse.dto.TimeSeriesPoint;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetricsService {

    private final InfluxQueryService influxQueryService;

    public MetricsService(InfluxQueryService influxQueryService) {
        this.influxQueryService = influxQueryService;
    }

    public List<MetricSummary> getSummary() {
        return List.of(
                influxQueryService.querySummary("cpu", "usage_idle"),
                influxQueryService.querySummary("mem", "used_percent"),
                influxQueryService.querySummary("disk", "used_percent"),
                influxQueryService.querySummary("net", "bytes_recv")
        );
    }

    public MetricsResponse getTimeSeries(
            String measurement, String field, String range, String aggregation) {
        List<TimeSeriesPoint> points = influxQueryService.queryAggregated(
                measurement, field, range, aggregation);
        return new MetricsResponse(measurement, field, range, points);
    }

    public List<String> getMeasurements() {
        return influxQueryService.listMeasurements();
    }

    public List<String> getFields(String measurement) {
        return influxQueryService.listFields(measurement);
    }
}
