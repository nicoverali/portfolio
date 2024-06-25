import Smartlook from "smartlook-client";
import type { AnalyticsTrackParam } from "./types";

interface SmartlookPluginConfig {
  id: string;
  region: "eu" | "us";
  cookies?: boolean;
}

const defaultConfig: SmartlookPluginConfig = {
  id: "",
  region: "eu",
  cookies: true,
};

export default function smartlookAnalytics(config: SmartlookPluginConfig) {
  const initConfig = {
    ...defaultConfig,
    ...config,
  };

  return {
    name: "smartlook-plugin",
    config: initConfig,
    initialize: ({ config }: { config: SmartlookPluginConfig }) => {
      Smartlook.init(config.id, {
        region: config.region,
        cookies: config.cookies,
      });
    },
    track: ({ payload }: AnalyticsTrackParam) => {
      Smartlook.track(payload.event, payload.properties);
    },
    loaded: Smartlook.initialized,
  };
}
