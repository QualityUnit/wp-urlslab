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

export async function augmentWithDomainContext( domains, prompt, model, semanticContext ) {
	if ( ! semanticContext ) {
		return await postFetch(
			'generator/augment',
			{
				domain_filter: domains,
				user_prompt: prompt,
				semantic_context: semanticContext,
				model,
			}
		);
	}
	return await postFetch(
		'generator/augment',
		{
			domain_filter: domains,
			user_prompt: prompt,
			model,
		}
	);
}

export async function augmentWithoutContext( prompt, model ) {
	return await postFetch(
		'generator/augment',
		{
			user_prompt: prompt,
			model,
		}
	);
}

export async function getAugmentProcessResult( processId ) {
	return await getFetch( `process/complex-augment/${ processId }` );
}

export async function getPromptTemplates( filters ) {
	return await postFetch( 'prompt-template', { filters } );
}

export async function getPostTypes() {
	return await getFetch( `generator/post` );
}

export async function createPost( postContent, postTitle, postType ) {
	return await postFetch(
		'generator/post/create',
		{
			post_content: postContent,
			post_type: postType,
			post_title: postTitle,
		}
	);
}

