import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logoIcon: z.optional(z.string()),
      short: z.string(),
      description: z.string(),
      repository: z.optional(z.string()),
      demo: z.optional(z.string()),
      featured: z.optional(z.boolean()),
      screenshots: z.array(image()),
      techs: z.array(z.string()),
    }),
});

export const collections = {
  projects: projectsCollection,
};
