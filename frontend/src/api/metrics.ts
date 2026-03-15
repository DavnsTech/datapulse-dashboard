import apiClient from "./client";

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface MetricSummary {
  measurement: string;
  field: string;
  lastValue: number;
  meanValue: number;
  maxValue: number;
  minValue: number;
}

export interface MetricsResponse {
  measurement: string;
  field: string;
  range: string;
  points: TimeSeriesPoint[];
}

export interface DashboardConfig {
  id: string;
  name: string;
  panels: PanelConfig[];
}

export interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PanelConfig {
  id: string;
  title: string;
  chartType: string;
  measurement: string;
  field: string;
  aggregation: string;
  grid: GridPosition;
}

export async function fetchSummary(): Promise<MetricSummary[]> {
  const response = await apiClient.get<MetricSummary[]>("/metrics/summary");
  return response.data;
}

export async function fetchTimeSeries(
  measurement: string,
  field: string,
  range: string,
  aggregation: string = "mean"
): Promise<MetricsResponse> {
  const response = await apiClient.get<MetricsResponse>("/metrics/timeseries", {
    params: { measurement, field, range, aggregation },
  });
  return response.data;
}

export async function fetchMeasurements(): Promise<string[]> {
  const response = await apiClient.get<string[]>("/metrics/measurements");
  return response.data;
}

export async function fetchFields(measurement: string): Promise<string[]> {
  const response = await apiClient.get<string[]>("/metrics/fields", {
    params: { measurement },
  });
  return response.data;
}

export async function fetchDashboard(id: string): Promise<DashboardConfig> {
  const response = await apiClient.get<DashboardConfig>(`/dashboards/${id}`);
  return response.data;
}

export async function fetchDashboards(): Promise<DashboardConfig[]> {
  const response = await apiClient.get<DashboardConfig[]>("/dashboards");
  return response.data;
}

export async function updateDashboard(
  id: string,
  dashboard: DashboardConfig
): Promise<DashboardConfig> {
  const response = await apiClient.put<DashboardConfig>(`/dashboards/${id}`, dashboard);
  return response.data;
}
