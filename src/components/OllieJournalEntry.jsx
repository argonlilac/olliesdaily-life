import {
	StoryblokServerRichText,
	storyblokEditable,
} from '@storyblok/react/rsc';
import Link from 'next/link';

const OllieJournalEntry = ({ blok }) => {
	const formattedDate = blok.date
		? new Date(blok.date).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'long',
				timeZone: 'UTC',
				year: 'numeric',
			})
		: null;

	return (
		<main className="entry-page section-wrap" {...storyblokEditable(blok)}>
			<Link className="back-link" href="/#journal">
				<span aria-hidden="true">←</span> All journal entries
			</Link>
			<article className="entry-article">
				<header className="entry-heading">
					{formattedDate ? (
						<time dateTime={blok.date}>{formattedDate}</time>
					) : null}
					<h1>{blok.title}</h1>
					{blok.summary ? <p>{blok.summary}</p> : null}
				</header>
				<div className="entry-image image-frame">
					{blok.cover_image?.filename ? (
						<img
							src={blok.cover_image.filename}
							alt={blok.cover_image.alt || blok.title || ''}
						/>
					) : null}
				</div>
				<div className="entry-body">
					{blok.body ? <StoryblokServerRichText document={blok.body} /> : null}
				</div>
			</article>
		</main>
	);
};

export default OllieJournalEntry;