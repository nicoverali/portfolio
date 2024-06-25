import Analytics, { type AnalyticsInstance } from "analytics";
import type { AnalyticsEvent, AnalyticsPayload } from "./types";
import getAnalyticsPlugins from "./plugins";

let analytics: AnalyticsInstance;

const globalPayload: AnalyticsPayload = {};

export const init = (payload?: AnalyticsPayload) => {
  addGlobalPayload(payload);
  analytics = Analytics({
    app: "NicolasVera-Portfolio",
    plugins: getAnalyticsPlugins(),
    debug: import.meta.env.DEV,
  });
};

export const triggerPageView = () => {
  analytics.page(globalPayload);
};

export const addGlobalPayload = (payload?: AnalyticsPayload) => {
  Object.assign(globalPayload, payload);
};

export const triggerEvent = (event: AnalyticsEvent | string) => {
  if (typeof event === "string") {
    analytics.track(event, globalPayload);
  } else {
    analytics.track(event.name, { ...globalPayload, ...event.payload });
  }
};
