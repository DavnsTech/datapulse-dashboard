package com.davnstech.datapulse.controller;

import com.davnstech.datapulse.dto.MetricSummary;
import com.davnstech.datapulse.dto.MetricsResponse;
import com.davnstech.datapulse.service.MetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final MetricsService metricsService;

    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<List<MetricSummary>> getSummary() {
        return ResponseEntity.ok(metricsService.getSummary());
    }

    @GetMapping("/timeseries")
    public ResponseEntity<MetricsResponse> getTimeSeries(
            @RequestParam String measurement,
            @RequestParam String field,
            @RequestParam(defaultValue = "1h") String range,
            @RequestParam(defaultValue = "mean") String aggregation) {
        return ResponseEntity.ok(metricsService.getTimeSeries(measurement, field, range, aggregation));
    }

    @GetMapping("/measurements")
    public ResponseEntity<List<String>> getMeasurements() {
        return ResponseEntity.ok(metricsService.getMeasurements());
    }

    @GetMapping("/fields")
    public ResponseEntity<List<String>> getFields(@RequestParam String measurement) {
        return ResponseEntity.ok(metricsService.getFields(measurement));
    }
}
