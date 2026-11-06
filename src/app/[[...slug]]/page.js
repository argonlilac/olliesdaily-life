import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { getStoryblokApi } from '@/lib/storyblok';

export default async function Page({ params }) {
	const { slug } = await params;

	const fullSlug = slug?.length ? slug.join('/') : 'test14ollie';

	const sbParams = {
		version: 'draft',
	};

	const storyblokApi = getStoryblokApi();
	let data;
	try {
		({ data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams));
	} catch (error) {
		if (error.status === 404) notFound();
		throw error;
	}

	return <StoryblokStory story={data.story} />;
}
