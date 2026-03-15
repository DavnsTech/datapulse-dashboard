package com.davnstech.datapulse.service;

import com.davnstech.datapulse.dto.MetricSummary;
import com.davnstech.datapulse.dto.TimeSeriesPoint;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class InfluxQueryService {

    private static final Logger log = LoggerFactory.getLogger(InfluxQueryService.class);
    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("[a-zA-Z0-9_]+");
    private static final Set<String> VALID_RANGES = Set.of("1h", "6h", "24h", "7d", "30d");
    private static final Set<String> VALID_AGGREGATIONS = Set.of("mean", "max", "min", "last", "count");

    private final InfluxDBClient influxDBClient;
    private final String org;
    private final String bucket;

    public InfluxQueryService(
            InfluxDBClient influxDBClient,
            @Value("${influxdb.org}") String org,
            @Value("${influxdb.bucket}") String bucket) {
        this.influxDBClient = influxDBClient;
        this.org = org;
        this.bucket = bucket;
    }

    public List<TimeSeriesPoint> queryTimeSeries(
            String measurement, String field, String range) {
        validateIdentifier(measurement, "measurement");
        validateIdentifier(field, "field");
        validateRange(range);

        String flux = String.format("""
                from(bucket: "%s")
                  |> range(start: -%s)
                  |> filter(fn: (r) => r._measurement == "%s")
                  |> filter(fn: (r) => r._field == "%s")
                  |> aggregateWindow(every: %s, fn: mean, createEmpty: false)
                  |> yield(name: "mean")
                """, bucket, range, measurement, field, windowForRange(range));

        return executeTimeSeriesQuery(flux);
    }

    public List<TimeSeriesPoint> queryAggregated(
            String measurement, String field, String range, String aggregation) {
        validateIdentifier(measurement, "measurement");
        validateIdentifier(field, "field");
        validateRange(range);
        validateAggregation(aggregation);

        String flux = String.format("""
                from(bucket: "%s")
                  |> range(start: -%s)
                  |> filter(fn: (r) => r._measurement == "%s")
                  |> filter(fn: (r) => r._field == "%s")
                  |> aggregateWindow(every: %s, fn: %s, createEmpty: false)
                  |> yield(name: "result")
                """, bucket, range, measurement, field, windowForRange(range), aggregation);

        return executeTimeSeriesQuery(flux);
    }

    public MetricSummary querySummary(String measurement, String field) {
        validateIdentifier(measurement, "measurement");
        validateIdentifier(field, "field");

        String flux = String.format("""
                import "math"

                data = from(bucket: "%s")
                  |> range(start: -1h)
                  |> filter(fn: (r) => r._measurement == "%s")
                  |> filter(fn: (r) => r._field == "%s")

                last = data |> last() |> yield(name: "last")
                mean = data |> mean() |> yield(name: "mean")
                max = data |> max() |> yield(name: "max")
                min = data |> min() |> yield(name: "min")
                """, bucket, measurement, field);

        QueryApi queryApi = influxDBClient.getQueryApi();
        double lastValue = 0, meanValue = 0, maxValue = 0, minValue = 0;

        try {
            List<FluxTable> tables = queryApi.query(flux, org);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    String resultName = (String) record.getValueByKey("result");
                    double value = toDouble(record.getValue());
                    switch (resultName) {
                        case "last" -> lastValue = value;
                        case "mean" -> meanValue = value;
                        case "max" -> maxValue = value;
                        case "min" -> minValue = value;
                    }
                }
            }
        } catch (Exception exception) {
            log.error("Failed to query summary for {}.{}", measurement, field, exception);
        }

        return new MetricSummary(measurement, field, lastValue, meanValue, maxValue, minValue);
    }

    public List<String> listMeasurements() {
        String flux = String.format("""
                import "influxdata/influxdb/schema"
                schema.measurements(bucket: "%s")
                """, bucket);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<String> measurements = new ArrayList<>();

        try {
            List<FluxTable> tables = queryApi.query(flux, org);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    measurements.add((String) record.getValue());
                }
            }
        } catch (Exception exception) {
            log.error("Failed to list measurements", exception);
        }

        return measurements;
    }

    public List<String> listFields(String measurement) {
        String flux = String.format("""
                import "influxdata/influxdb/schema"
                schema.measurementFieldKeys(bucket: "%s", measurement: "%s")
                """, bucket, measurement);

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<String> fields = new ArrayList<>();

        try {
            List<FluxTable> tables = queryApi.query(flux, org);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    fields.add((String) record.getValue());
                }
            }
        } catch (Exception exception) {
            log.error("Failed to list fields for {}", measurement, exception);
        }

        return fields;
    }

    private List<TimeSeriesPoint> executeTimeSeriesQuery(String flux) {
        QueryApi queryApi = influxDBClient.getQueryApi();
        List<TimeSeriesPoint> points = new ArrayList<>();

        try {
            List<FluxTable> tables = queryApi.query(flux, org);
            for (FluxTable table : tables) {
                for (FluxRecord record : table.getRecords()) {
                    Instant time = record.getTime();
                    double value = toDouble(record.getValue());
                    if (time != null) {
                        points.add(new TimeSeriesPoint(time, value));
                    }
                }
            }
        } catch (Exception exception) {
            log.error("Flux query failed: {}", flux.lines().findFirst().orElse(""), exception);
        }

        return points;
    }

    private String windowForRange(String range) {
        return switch (range) {
            case "1h" -> "1m";
            case "6h" -> "5m";
            case "24h" -> "15m";
            case "7d" -> "1h";
            case "30d" -> "6h";
            default -> "5m";
        };
    }

    private double toDouble(Object value) {
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        return 0.0;
    }

    private void validateIdentifier(String value, String paramName) {
        if (value == null || !IDENTIFIER_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid " + paramName + ": " + value);
        }
    }

    private void validateRange(String range) {
        if (!VALID_RANGES.contains(range)) {
            throw new IllegalArgumentException("Invalid range: " + range);
        }
    }

    private void validateAggregation(String aggregation) {
        if (!VALID_AGGREGATIONS.contains(aggregation)) {
            throw new IllegalArgumentException("Invalid aggregation: " + aggregation);
        }
    }
}
