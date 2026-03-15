import apiClient from "./client";

export interface AlertRule {
  id: string;
  name: string;
  measurement: string;
  field: string;
  condition: string;
  threshold: number;
  enabled: boolean;
}

export interface AlertEvent {
  ruleId: string;
  ruleName: string;
  measurement: string;
  field: string;
  value: number;
  threshold: number;
  condition: string;
  firedAt: string;
}

export async function fetchAlertRules(): Promise<AlertRule[]> {
  const response = await apiClient.get<AlertRule[]>("/alerts/rules");
  return response.data;
}

export async function createAlertRule(rule: Omit<AlertRule, "id">): Promise<AlertRule> {
  const response = await apiClient.post<AlertRule>("/alerts/rules", rule);
  return response.data;
}

export async function deleteAlertRule(id: string): Promise<void> {
  await apiClient.delete(`/alerts/rules/${id}`);
}

export async function fetchAlertEvents(): Promise<AlertEvent[]> {
  const response = await apiClient.get<AlertEvent[]>("/alerts/events");
  return response.data;
}
