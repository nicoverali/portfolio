import { defineConfig } from "astro/config";
import icon from "astro-icon";

import react from "@astrojs/react";
import remarkAnimSplit from "./src/scripts/remark-anim-split-plugin";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  markdown: {
    remarkPlugins: [remarkAnimSplit],
  },
  integrations: [
    icon({
      iconDir: "src/assets/icons",
      svgoOptions: { plugins: ["prefixIds"] },
    }),
    react(),
  ],
});
