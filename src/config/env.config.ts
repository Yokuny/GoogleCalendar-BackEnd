import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  PORT: z.string().max(4).min(4),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
