package com.davnstech.datapulse.controller;

import com.davnstech.datapulse.domain.AlertEvent;
import com.davnstech.datapulse.domain.AlertRule;
import com.davnstech.datapulse.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/rules")
    public ResponseEntity<List<AlertRule>> listRules() {
        return ResponseEntity.ok(alertService.listRules());
    }

    @GetMapping("/rules/{id}")
    public ResponseEntity<AlertRule> getRule(@PathVariable String id) {
        return alertService.getRule(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/rules")
    public ResponseEntity<AlertRule> createRule(@RequestBody AlertRule rule) {
        return ResponseEntity.ok(alertService.createRule(rule));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<AlertRule> updateRule(
            @PathVariable String id, @RequestBody AlertRule rule) {
        return alertService.updateRule(id, rule)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable String id) {
        if (alertService.deleteRule(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/events")
    public ResponseEntity<List<AlertEvent>> listEvents() {
        return ResponseEntity.ok(alertService.listEvents());
    }
}
