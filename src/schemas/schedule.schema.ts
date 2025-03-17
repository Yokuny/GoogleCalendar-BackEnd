import { lengthMessage } from "helpers/zodMessage.helper";
import { z } from "zod";

export const scheduleSchema = z.object({
  description: z.string().trim().min(5, lengthMessage(5, 30)).max(30, lengthMessage(5, 30)),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  googleEventID: z.string().optional(),
});

export type NewSchedule = z.infer<typeof scheduleSchema>;
