import { z } from "zod";

export function getSettingSchemaDynamic(
	domain: string,
	key: string,
	allowedSettings: any,
) {
	const setting = allowedSettings[domain]?.[key];

	if (!setting) {
		// Unknown key → allow anything
		return z.object({
			domain: z.string(),
			key: z.string(),
			value: z.any().optional(),
			file: z.instanceof(File).optional(),
		});
	}

	// Check if this setting is a file
	if (setting.type === "file") {
		return z.object({
			domain: z.string(),
			key: z.string(),
			file: z.instanceof(File),
			value: z.any().optional(), // value can be ignored
		});
	}

	// Build value schema for non-file settings
	let valueSchema: z.ZodTypeAny;

	switch (setting.type) {
		case "str":
			valueSchema = z.string().min(1);
			break;
		case "int":
			valueSchema = z
				.string()
				.refine((v) => !isNaN(Number(v)), "Must be a number")
				.transform(Number);
			break;
		case "bool":
			valueSchema = z
				.union([z.string(), z.boolean()])
				.transform((v) => v === true || v === "true" || v === "1");
			break;
		case "json": {
			const keys = setting.allowed_keys || [];
			valueSchema = z
				.object(
					Object.fromEntries(
						keys.map((k: string) => [k, z.string().optional()]),
					),
				)
				.strict();
			break;
		}
		default:
			valueSchema = z.any();
	}

	return z.object({
		domain: z.string(),
		key: z.string(),
		value: valueSchema,
		file: z.instanceof(File).optional(), // allow file optionally
	});
}
