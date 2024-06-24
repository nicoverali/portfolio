export type AnalyticsPlugin = Record<string, unknown>;

export type AnalyticsPayload = Record<string, string | number | boolean>;

export interface AnalyticsEvent {
  name: string;
  payload: AnalyticsPayload;
}

export interface AnalyticsTrackParam {
  payload: {
    event: string;
    properties: AnalyticsPayload;
  };
}
