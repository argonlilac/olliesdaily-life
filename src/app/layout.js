import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';
import Link from 'next/link';

export const metadata = {
	title: "Ollie's Daily Life",
	description: 'Small adventures and quiet days with Ollie.',
};

export default function RootLayout({ children }) {
	return (
		<StoryblokProvider>
			<html lang="en">
				<body>
					<header className="site-header">
						<div className="header-inner">
							<Link className="wordmark" href="/">
								Ollie&apos;s Daily Life
							</Link>
							<nav aria-label="Main navigation">
								<Link href="/">Home</Link>
								<Link href="/#journal">Journal</Link>
								<Link href="/#about">About</Link>
							</nav>
						</div>
					</header>
					{children}
					<footer className="site-footer">
						<Link className="wordmark" href="/">
							Ollie&apos;s Daily Life
						</Link>
						<p>Built with Storyblok and Next.js.</p>
					</footer>
				</body>
			</html>
		</StoryblokProvider>
	);
}
