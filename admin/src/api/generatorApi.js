import { getFetch, postFetch } from './fetching';

export async function augmentWithURLContext( urls, prompt, model ) {
	return await postFetch(
		'generator/augment/with-context/urls',
		{
			urls,
			prompt,
			model,
		},
		{ skipErrorHandling: true }
	);
}

export async function augmentWithDomainContext( domains, prompt, model, semanticContext ) {
	if ( ! semanticContext ) {
		return await postFetch(
			'generator/augment',
			{
				domain_filter: domains,
				user_prompt: prompt,
				model,
			},
			{ skipErrorHandling: true }
		);
	}
	return await postFetch(
		'generator/augment',
		{
			domain_filter: domains,
			user_prompt: prompt,
			model,
		},
		{ skipErrorHandling: true }
	);
}

export async function augmentWithoutContext( prompt, model ) {
	return await postFetch(
		'generator/augment',
		{
			user_prompt: prompt,
			model,
		},
		{ skipErrorHandling: true }
	);
}

export async function getAugmentProcessResult( processId ) {
	return await getFetch( `process/complex-augment/${ processId }` );
}

export async function getPromptTemplates( filters ) {
	const response = await postFetch( 'prompt-template', { filters } );
	if ( response.ok ) {
		return await response.json();
	}
	return [];
}

export async function getPostTypes() {
	const response = await getFetch( `generator/post` );
	if ( response.ok ) {
		return await response.json();
	}
	return {};
}

export async function createPost( postContent, postTitle, postType ) {
	const response = await postFetch(
		'generator/post/create',
		{
			post_content: postContent,
			post_type: postType,
			post_title: postTitle,
		}
	);
	if ( response.ok ) {
		return await response.json();
	}
	return false;
}

export async function createPromptTemplate( data ) {
	return await postFetch( 'prompt-template/create', data, { skipErrorHandling: true } );
}
