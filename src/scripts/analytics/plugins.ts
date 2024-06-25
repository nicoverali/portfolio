// @ts-ignore
import googleAnalytics from "@analytics/google-analytics";
import smartlookAnalytics from "./smartlook";

const getAnalyticsPlugins = () => {
  const plugins = [];

  const googleAnalyticsId = import.meta.env.PUBLIC_GOOGLE_TAG_ID;
  if (googleAnalyticsId) {
    plugins.push(
      googleAnalytics({
        measurementIds: [googleAnalyticsId],
      })
    );
  } else {
    console.warn("No google analytics id found");
  }

  const smartlookAnalyticsId = import.meta.env.PUBLIC_SMARTLOOK_ID;
  if (smartlookAnalyticsId) {
    plugins.push(
      smartlookAnalytics({
        id: smartlookAnalyticsId,
        region: "eu",
        cookies: false,
      })
    );
  } else {
    console.warn("No smartlook analytics id found");
  }

  return plugins;
};

export default getAnalyticsPlugins;
