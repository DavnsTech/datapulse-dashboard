package com.davnstech.datapulse.service;

import com.davnstech.datapulse.domain.AlertEvent;
import com.davnstech.datapulse.domain.AlertRule;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class AlertService {

    private static final int MAX_EVENTS = 100;

    private final Map<String, AlertRule> rules = new ConcurrentHashMap<>();
    private final Deque<AlertEvent> events = new ConcurrentLinkedDeque<>();

    public List<AlertRule> listRules() {
        return List.copyOf(rules.values());
    }

    public Optional<AlertRule> getRule(String id) {
        return Optional.ofNullable(rules.get(id));
    }

    public AlertRule createRule(AlertRule rule) {
        String id = UUID.randomUUID().toString().substring(0, 8);
        AlertRule created = new AlertRule(
                id, rule.name(), rule.measurement(), rule.field(),
                rule.condition(), rule.threshold(), true);
        rules.put(id, created);
        return created;
    }

    public Optional<AlertRule> updateRule(String id, AlertRule rule) {
        if (!rules.containsKey(id)) {
            return Optional.empty();
        }
        AlertRule updated = new AlertRule(
                id, rule.name(), rule.measurement(), rule.field(),
                rule.condition(), rule.threshold(), rule.enabled());
        rules.put(id, updated);
        return Optional.of(updated);
    }

    public boolean deleteRule(String id) {
        return rules.remove(id) != null;
    }

    public void addEvent(AlertEvent event) {
        events.addFirst(event);
        while (events.size() > MAX_EVENTS) {
            events.removeLast();
        }
    }

    public List<AlertEvent> listEvents() {
        return List.copyOf(events);
    }
}
