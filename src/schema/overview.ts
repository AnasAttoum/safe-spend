import { differenceInDays } from "date-fns";
import { z } from "zod";

export const overviewSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    const { from, to } = args;
    const days = differenceInDays(to, from);
    return days >= 0;
  });
