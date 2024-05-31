import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      short: z.string(),
      description: z.string(),
      repository: z.optional(z.string()),
      demo: z.optional(z.string()),
      featuredImage: image(),
      screenshots: z.array(image()),
      techs: z.array(z.string()),
    }),
});

const experienceCollection = defineCollection({
  type: "data",
  schema: () =>
    z.object({
      company: z.string(),
      jobTitle: z.string(),
      from: z.string(),
      to: z.string(),
    }),
});

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
};
