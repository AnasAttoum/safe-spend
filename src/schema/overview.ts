import { differenceInDays } from "date-fns";
import { z } from "zod";

export const overviewSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    categoryId: z.string().min(1).max(100).optional().nullable(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);
    return days >= 0;
  });
