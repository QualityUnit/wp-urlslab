import { getFetch, postFetch } from './fetching';

export async function augmentWithURLContext( urls, prompt, model ) {
	return await postFetch(
		'generator/augment/with-context/urls',
		{
			urls,
			prompt,
			model,
		}
	);
}

export async function getAugmentProcessResult( processId ) {
	return await getFetch( `process/complex-augment/${ processId }` );
}
