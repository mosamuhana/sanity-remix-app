import { Logo } from "./Logo";

export function Footer() {
	return (
		<header className="border-t border-gray-100 transition-colors duration-1000 ease-in-out dark:border-gray-900">
			<div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
				<Logo />
				<div className="flex flex-1 flex-col items-end justify-end gap-2 text-sm md:flex-row md:items-center md:gap-5">
					<a
						className="hover:text-cyan-600 dark:hover:text-cyan-200"
						href="/studio"
					>
						Log in to Sanity Studio v3
					</a>
					<a
						className="hover:text-cyan-600 dark:hover:text-cyan-200"
						target="_blank"
						rel="noreferrer"
						href="https://sanity.io"
					>
						Sign up free at Sanity.io
					</a>
					<a
						className="hover:text-cyan-600 dark:hover:text-cyan-200"
						target="_blank"
						rel="noreferrer"
						href="https://github.com/mosamuhana/sanity-remix-app"
					>
						Clone this project on GitHub
					</a>
				</div>
			</div>
		</header>
	);
}
