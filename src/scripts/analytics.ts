import Analytics from "analytics";
import googleAnalytics from "@analytics/google-analytics";

export interface AnalyticsEvent {
  name: string;
  payload: Record<string, string | number | boolean>;
}

const getAnalyticsPlugins = () => {
  const plugins = [];

  const googleAnalyticsId = import.meta.env.GOOGLE_TAG_ID;
  if (googleAnalyticsId) {
    plugins.push(
      googleAnalytics({
        trackingId: googleAnalyticsId,
      })
    );
  } else {
    console.warn("No google analytics id found");
  }

  return plugins;
};

const analytics = Analytics({
  app: "NicolasVera-Portfolio",
  plugins: getAnalyticsPlugins(),
});

analytics.page();

export const triggerEvent = (event: AnalyticsEvent | string) => {
  if (typeof event === "string") {
    analytics.track(event);
  } else {
    analytics.track(event.name, event.payload);
  }
};
