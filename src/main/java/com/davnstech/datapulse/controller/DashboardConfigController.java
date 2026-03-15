package com.davnstech.datapulse.controller;

import com.davnstech.datapulse.domain.DashboardConfig;
import com.davnstech.datapulse.service.DashboardConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboards")
public class DashboardConfigController {

    private final DashboardConfigService dashboardConfigService;

    public DashboardConfigController(DashboardConfigService dashboardConfigService) {
        this.dashboardConfigService = dashboardConfigService;
    }

    @GetMapping
    public ResponseEntity<List<DashboardConfig>> listAll() {
        return ResponseEntity.ok(dashboardConfigService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DashboardConfig> getById(@PathVariable String id) {
        return dashboardConfigService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DashboardConfig> create(@RequestBody DashboardConfig dashboard) {
        return ResponseEntity.ok(dashboardConfigService.create(dashboard));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DashboardConfig> update(
            @PathVariable String id, @RequestBody DashboardConfig dashboard) {
        return dashboardConfigService.update(id, dashboard)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (dashboardConfigService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
