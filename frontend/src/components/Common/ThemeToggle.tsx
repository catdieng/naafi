import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const isDark = theme === "dark";

	return (
		<IconButton
			aria-label="Toggle theme"
			variant="ghost"
			size="sm"
			onClick={() => setTheme(isDark ? "light" : "dark")}
		>
			{isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
		</IconButton>
	);
}
