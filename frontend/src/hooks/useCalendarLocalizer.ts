import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import { useEffect, useState } from "react";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import { type DateLocalizer, dayjsLocalizer } from "react-big-calendar";

dayjs.extend(localeData);

export function useCalendarLocalizer(): DateLocalizer | null {
	const [localizer, setLocalizer] = useState<DateLocalizer | null>(null);

	useEffect(() => {
		const setupLocale = async () => {
			// Get the browser locale, e.g. "fr-FR"
			const browserLocale = navigator.language.split("-")[0];

			try {
				// Dynamically import the Day.js locale
				dayjs.locale(browserLocale);
			} catch {
				dayjs.locale("en"); // fallback
			}

			// Initialize the localizer
			setLocalizer(dayjsLocalizer(dayjs));
		};

		setupLocale();
	}, []);

	return localizer;
}
