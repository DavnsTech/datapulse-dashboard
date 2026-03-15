package com.davnstech.datapulse.service;

import com.davnstech.datapulse.domain.AlertEvent;
import com.davnstech.datapulse.domain.AlertRule;
import com.davnstech.datapulse.dto.MetricSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class AlertEvaluator {

    private static final Logger log = LoggerFactory.getLogger(AlertEvaluator.class);

    private final AlertService alertService;
    private final InfluxQueryService influxQueryService;

    public AlertEvaluator(AlertService alertService, InfluxQueryService influxQueryService) {
        this.alertService = alertService;
        this.influxQueryService = influxQueryService;
    }

    @Scheduled(fixedRate = 30000)
    public void evaluateRules() {
        for (AlertRule rule : alertService.listRules()) {
            if (!rule.enabled()) {
                continue;
            }
            evaluateSingleRule(rule);
        }
    }

    private void evaluateSingleRule(AlertRule rule) {
        try {
            MetricSummary summary = influxQueryService.querySummary(
                    rule.measurement(), rule.field());
            double currentValue = summary.lastValue();

            if (rule.evaluate(currentValue)) {
                AlertEvent event = new AlertEvent(
                        rule.id(), rule.name(),
                        rule.measurement(), rule.field(),
                        currentValue, rule.threshold(),
                        rule.condition(), Instant.now());
                alertService.addEvent(event);
                log.warn("Alert fired: {} ({} {} {})",
                        rule.name(), currentValue, rule.condition(), rule.threshold());
            }
        } catch (Exception exception) {
            log.error("Failed to evaluate alert rule {}", rule.name(), exception);
        }
    }
}
