import { useFetcher, useLoaderData } from "@remix-run/react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const { state, Form } = useFetcher();
	const { themePreference } = useLoaderData();
	const isDarkMode = themePreference === `dark`;

	return (
		<Form method="post" action="/resource/toggle-theme">
			<button type="submit" disabled={state === "submitting"}>
				{isDarkMode
          ? (<Sun className="h-auto w-4" />)
          : (<Moon className="h-auto w-4" />)
        }
				<div className="sr-only select-none">
					{isDarkMode ? `Light` : `Dark`} Mode
				</div>
			</button>
		</Form>
	);
}
