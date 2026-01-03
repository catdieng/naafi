import { z } from "zod";

export const OptionSchema = z.object({
	label: z.string(),
	value: z.number().int(),
});
