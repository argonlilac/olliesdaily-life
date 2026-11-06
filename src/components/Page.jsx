import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc';
import Link from 'next/link';
import { getStoryblokApi } from '@/lib/storyblok';

const formatDate = (date) =>
	date
		? new Date(date).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'long',
				timeZone: 'UTC',
				year: 'numeric',
			})
		: null;

const Page = async ({ blok }) => {
	const storyblokApi = getStoryblokApi();
	const { data } = await storyblokApi.get('cdn/stories', {
		content_type: 'ollie_journal_entry',
		per_page: 100,
		sort_by: 'content.date:desc',
		version: 'draft',
	});
	const entries = data.stories ?? [];

	return (
		<main {...storyblokEditable(blok)}>
			<section
				className={`hero section-wrap${blok.hero_image?.filename ? '' : ' hero--text-only'}`}
			>
				<div className="hero-copy">
					<p className="eyebrow">
						{blok.eyebrow || 'A VERY IMPORTANT LITTLE LIFE'}
					</p>
					<h1>{blok.headline || 'Life according to Ollie.'}</h1>
					<p className="hero-subtitle">
						{blok.subtitle ||
							'Small adventures, long walks, and a very serious commitment to afternoon naps.'}
					</p>
					<a className="text-link" href="#journal">
						Read the journal <span aria-hidden="true">↗</span>
					</a>
				</div>
				{blok.hero_image?.filename ? (
					<div className="hero-image image-frame">
						<img
							src={blok.hero_image.filename}
							alt={blok.hero_image.alt || 'Ollie'}
						/>
					</div>
				) : null}
			</section>

			{blok.body?.length > 0 ? (
				<div className="page-blocks section-wrap">
					{blok.body.map((nestedBlok) => (
						<StoryblokServerComponent
							blok={nestedBlok}
							key={nestedBlok._uid}
						/>
					))}
				</div>
			) : null}

			<section className="journal section-wrap" id="journal">
				<div className="section-heading">
					<div>
						<p className="eyebrow">FROM OLLIE&apos;S NOTEBOOK</p>
						<h2>{blok.journal_heading || 'The Daily Dispatch'}</h2>
					</div>
					<p className="section-intro">
						{blok.journal_subtitle ||
							'Notes from a life of walks, snacks, naps, and occasional mischief.'}
					</p>
				</div>

				{entries.length ? (
					<div className="journal-grid">
						{entries.map((story) => {
							const entry = story.content;
							const image = entry.cover_image;

							return (
								<article
									className="journal-card"
									key={story.uuid}
									{...storyblokEditable(entry)}
								>
									<Link
										className="journal-card-link"
										href={`/${story.full_slug}`}
									>
										<div className="journal-image image-frame">
											{image?.filename ? (
												<img
													src={image.filename}
													alt={image.alt || entry.title || ''}
												/>
											) : null}
										</div>
										<div className="journal-card-copy">
											{entry.date ? (
												<time dateTime={entry.date}>
													{formatDate(entry.date)}
												</time>
											) : null}
											<h3>{entry.title}</h3>
											{entry.summary ? <p>{entry.summary}</p> : null}
											<span className="text-link">
												Read the entry <span aria-hidden="true">↗</span>
											</span>
										</div>
									</Link>
								</article>
							);
						})}
					</div>
				) : (
					<p className="empty-state">
						The first dispatch is still being written.
					</p>
				)}
			</section>

			<section className="about section-wrap" id="about">
				<p className="eyebrow">A LITTLE INTRODUCTION</p>
				<h2>{blok.about_heading || 'Meet Ollie.'}</h2>
				<p className="about-copy">
					{blok.about_text ||
						"Part-time explorer, full-time nap enthusiast. This little corner of the internet documents the important things in Ollie's world."}
				</p>
			</section>
		</main>
	);
};

export default Page;
