export const ALLOWED_SETTINGS = {
	company: {
		name: { type: "str" },
		logo_url: { type: "str" },
		address: {
			type: "json",
			allowed_keys: ["street", "city", "zip", "country"],
		},
		phone: { type: "str" },
		email: { type: "str" },
		currency: { type: "str" },
		currency_symbol: { type: "str" },
		timezone: { type: "str" },
		locale: { type: "str" },
	},
	billing: {
		invoice_prefix: { type: "str" },
		invoice_footer: { type: "str" },
		invoice_notes: { type: "str" },
		due_days: { type: "int" },
	},
} as const;

export type Domain = keyof typeof ALLOWED_SETTINGS; // "company" | "billing"
export type DomainKey<D extends Domain> = keyof (typeof ALLOWED_SETTINGS)[D];
