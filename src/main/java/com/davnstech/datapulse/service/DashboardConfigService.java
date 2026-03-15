package com.davnstech.datapulse.service;

import com.davnstech.datapulse.domain.DashboardConfig;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DashboardConfigService {

    private static final Logger log = LoggerFactory.getLogger(DashboardConfigService.class);

    private final Path storagePath;
    private final ObjectMapper objectMapper;

    public DashboardConfigService(@Value("${dashboards.storage-path}") String storagePath) {
        this.storagePath = Path.of(storagePath);
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(storagePath);
            if (listAll().isEmpty()) {
                createDefaultDashboard();
            }
        } catch (IOException exception) {
            log.error("Failed to initialize dashboard storage", exception);
        }
    }

    public List<DashboardConfig> listAll() {
        try (var files = Files.list(storagePath)) {
            return files
                    .filter(path -> path.toString().endsWith(".json"))
                    .map(this::readDashboard)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .toList();
        } catch (IOException exception) {
            log.error("Failed to list dashboards", exception);
            return List.of();
        }
    }

    public Optional<DashboardConfig> getById(String id) {
        Path filePath = storagePath.resolve(id + ".json");
        return readDashboard(filePath);
    }

    public DashboardConfig create(DashboardConfig dashboard) {
        String id = UUID.randomUUID().toString().substring(0, 8);
        Instant now = Instant.now();
        DashboardConfig created = new DashboardConfig(
                id, dashboard.name(), dashboard.panels(), now, now);
        writeDashboard(created);
        return created;
    }

    public Optional<DashboardConfig> update(String id, DashboardConfig dashboard) {
        if (getById(id).isEmpty()) {
            return Optional.empty();
        }
        DashboardConfig updated = new DashboardConfig(
                id, dashboard.name(), dashboard.panels(),
                dashboard.createdAt(), Instant.now());
        writeDashboard(updated);
        return Optional.of(updated);
    }

    public boolean delete(String id) {
        try {
            return Files.deleteIfExists(storagePath.resolve(id + ".json"));
        } catch (IOException exception) {
            log.error("Failed to delete dashboard {}", id, exception);
            return false;
        }
    }

    private void createDefaultDashboard() {
        Path defaultFile = Path.of("data/default-dashboard.json");
        if (Files.exists(defaultFile)) {
            readDashboard(defaultFile).ifPresent(template -> {
                Instant now = Instant.now();
                DashboardConfig dashboard = new DashboardConfig(
                        template.id(), template.name(), template.panels(), now, now);
                writeDashboard(dashboard);
                log.info("Loaded default dashboard from template");
            });
            return;
        }

        Instant now = Instant.now();
        List<DashboardConfig.Panel> panels = List.of(
                new DashboardConfig.Panel("p1", "CPU Usage", "area", "cpu", "usage_idle", "mean", new DashboardConfig.GridPosition(0, 0, 6, 4)),
                new DashboardConfig.Panel("p2", "Memory Usage", "area", "mem", "used_percent", "mean", new DashboardConfig.GridPosition(6, 0, 6, 4)),
                new DashboardConfig.Panel("p3", "Active Users", "line", "business_metrics", "active_users", "mean", new DashboardConfig.GridPosition(0, 4, 6, 4)),
                new DashboardConfig.Panel("p4", "API Requests/sec", "bar", "business_metrics", "api_requests", "mean", new DashboardConfig.GridPosition(6, 4, 6, 4)),
                new DashboardConfig.Panel("p5", "Error Rate", "line", "business_metrics", "error_rate", "mean", new DashboardConfig.GridPosition(0, 8, 6, 4)),
                new DashboardConfig.Panel("p6", "Revenue Daily", "area", "business_metrics", "revenue_daily", "mean", new DashboardConfig.GridPosition(6, 8, 6, 4)),
                new DashboardConfig.Panel("p7", "Disk Usage", "area", "disk", "used_percent", "last", new DashboardConfig.GridPosition(0, 12, 6, 4)),
                new DashboardConfig.Panel("p8", "Network Throughput", "line", "net", "bytes_recv", "mean", new DashboardConfig.GridPosition(6, 12, 6, 4))
        );
        DashboardConfig defaultDashboard = new DashboardConfig(
                "default", "System Overview", panels, now, now);
        writeDashboard(defaultDashboard);
        log.info("Created default dashboard");
    }

    private void writeDashboard(DashboardConfig dashboard) {
        try {
            Path filePath = storagePath.resolve(dashboard.id() + ".json");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(filePath.toFile(), dashboard);
        } catch (IOException exception) {
            log.error("Failed to write dashboard {}", dashboard.id(), exception);
        }
    }

    private Optional<DashboardConfig> readDashboard(Path filePath) {
        if (!Files.exists(filePath)) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(filePath.toFile(), new TypeReference<>() {}));
        } catch (IOException exception) {
            log.error("Failed to read dashboard from {}", filePath, exception);
            return Optional.empty();
        }
    }
}
