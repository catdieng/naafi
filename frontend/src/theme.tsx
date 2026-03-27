import { createSystem, defaultConfig } from "@chakra-ui/react";
import { buttonRecipe } from "./theme/button.recipe";

export const system = createSystem(defaultConfig, {
	globalCss: {
		html: {
			fontSize: "16px",
		},
		body: {
			fontSize: "0.875rem",
			margin: 0,
			padding: 0,
		},
	},
	theme: {
		recipes: {
			button: buttonRecipe,
		},
	},
});
