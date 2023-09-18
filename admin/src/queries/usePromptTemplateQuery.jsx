/*
*   Hook to get supported AI models
*/

import { useQuery } from '@tanstack/react-query';
import { postFetch } from '../api/fetching';

const usePromptTemplateQuery = ( prompt_type = null ) => {
	return useQuery( {
		queryKey: [ 'prompt-template', prompt_type ],
		queryFn: async () => {
			const rsp = await postFetch( 'prompt-template', prompt_type ? { filters: [
				{
					col: 'prompt_type',
					op: 'eq',
					val: prompt_type,
				},
			] } : {} );
			if ( rsp.ok ) {
				const data = await rsp.json();
				return data.reduce( ( obj, item ) => {
					obj[ item.template_name ] = item;
					return obj;
				}, {} );
			}
		},
		refetchOnWindowFocus: false,
	} );
};

export default usePromptTemplateQuery;
